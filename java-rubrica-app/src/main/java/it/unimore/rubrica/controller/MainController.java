package it.unimore.rubrica.controller;

import it.unimore.rubrica.model.Contact;
import it.unimore.rubrica.model.JsonRepository;
import javafx.collections.transformation.FilteredList;
import javafx.collections.transformation.SortedList;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.control.cell.TextFieldTableCell;
import javafx.scene.layout.StackPane;
import javafx.scene.paint.Color;
import javafx.scene.paint.Paint;
import javafx.scene.shape.Circle;
import javafx.stage.FileChooser;
import javafx.stage.Modality;
import javafx.stage.Stage;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class MainController {

    @FXML private Label statsLabel;
    @FXML private TableView<Contact> table;
    @FXML private TableColumn<Contact, String> colName, colPhone, colEmail;
    @FXML private TextField searchField;
    @FXML private Button btnSelectAll;


    private JsonRepository repo;
    private FilteredList<Contact> filtered;
    private SortedList<Contact> sorted;


    public void initialize() {
        this.repo = new JsonRepository();

        // ===== Colonne e binding
        colName.setCellValueFactory(c -> c.getValue().nameProperty());
        colPhone.setCellValueFactory(c -> c.getValue().phoneProperty());
        colEmail.setCellValueFactory(c -> c.getValue().emailProperty());

        // Celle editabili (doppio click)
        table.setEditable(true);
        colName.setCellFactory(TextFieldTableCell.forTableColumn());
        colPhone.setCellFactory(TextFieldTableCell.forTableColumn());
        colEmail.setCellFactory(TextFieldTableCell.forTableColumn());

        colName.setOnEditCommit(e -> { e.getRowValue().setName(safe(e.getNewValue())); table.sort(); });
        colPhone.setOnEditCommit(e -> { e.getRowValue().setPhone(safe(e.getNewValue())); table.sort(); });
        colEmail.setOnEditCommit(e -> { e.getRowValue().setEmail(safe(e.getNewValue())); table.sort(); });

        // ===== Comparatori
        // Nome / Email: case-insensitive
        colName.setComparator((a, b) -> {
            String sa = a == null ? "" : a;
            String sb = b == null ? "" : b;
            int cmp = sa.compareToIgnoreCase(sb);
            // tie-breaker locale quando si ordina per Nome: no-op qui, si gestisce con sortOrder multiplo
            return cmp;
        });
        colEmail.setComparator((a, b) -> {
            String sa = a == null ? "" : a;
            String sb = b == null ? "" : b;
            return sa.compareToIgnoreCase(sb);
        });
        // Telefono: numerico se possibile, altrimenti lessicografico case-insensitive
        colPhone.setComparator((a, b) -> comparePhone(a, b));

        // ===== Filtro + Sorted=====
        filtered = new FilteredList<>(repo.findAll(), s -> true);
        sorted = new SortedList<>(filtered);
        sorted.comparatorProperty().bind(table.comparatorProperty());
        table.setItems(sorted);

        // 1) Resize policy moderna
        table.setColumnResizePolicy(TableView.CONSTRAINED_RESIZE_POLICY_FLEX_LAST_COLUMN);

        // 2) Colonne con percentuali
        colName.prefWidthProperty().bind(table.widthProperty().multiply(0.28));
        colPhone.prefWidthProperty().bind(table.widthProperty().multiply(0.22));
        colEmail.prefWidthProperty().bind(table.widthProperty().multiply(0.30));

        colName.setMinWidth(120);
        colPhone.setMinWidth(110);
        colEmail.setMinWidth(160);

        // ===== Ordine di default:
        colName.setSortType(TableColumn.SortType.ASCENDING);
        colPhone.setSortType(TableColumn.SortType.ASCENDING);
        colEmail.setSortType(TableColumn.SortType.ASCENDING);
        table.getSortOrder().setAll(colName, colPhone, colEmail);

        // ===== Ricerca
        searchField.textProperty().addListener((obs, old, val) -> {
            String q = val == null ? "" : val.toLowerCase();
            filtered.setPredicate(c ->
                    c.getName().toLowerCase().contains(q) ||
                            c.getPhone().toLowerCase().contains(q) ||
                            c.getEmail().toLowerCase().contains(q)
            );
        });

        // ===== Selezione multipla
        table.getSelectionModel().setSelectionMode(SelectionMode.MULTIPLE);

        // ===== AUTO-LOAD all'avvio
        try {
            repo.load();
            table.sort(); // rispetta l'ordinamento di default
            updateStats(); // Aggiorna il contatore dopo il caricamento
        } catch (Exception e) {
            showError(e);
        }

        // ===== AUTO-SAVE alla chiusura
        table.sceneProperty().addListener((obs, oldScene, newScene) -> {
            if (newScene == null) return;
            newScene.windowProperty().addListener((obsW, oldWin, newWin) -> {
                if (newWin == null) return;
                newWin.setOnCloseRequest(e -> {
                    try { repo.save(); } catch (Exception ignore) {}
                });
            });
        });

    }

    //===== Contatore dei Contatti ======
    private void updateStats() {
        int n = table.getItems() == null ? 0 : table.getItems().size();
        statsLabel.setText(n + (n == 1 ? " contatto" : " contatti"));
        System.out.println("Aggiornato il contatore: " + n + (n == 1 ? " contatto" : " contatti"));
    }

    // ===== Azioni

    @FXML private void onAdd() {
        try {
            FXMLLoader loader = new FXMLLoader(getClass().getResource("/view/add-contact.fxml"));
            var root = loader.load();
            AddContactController dlg = loader.getController();

            Stage dialog = new Stage();
            dialog.initOwner(table.getScene().getWindow());
            dialog.initModality(Modality.WINDOW_MODAL);
            dialog.setTitle("Nuovo contatto");
            dialog.setScene(new Scene( (Parent) root ));
            // carica lo stesso CSS della main, così la finestra ha lo stile giusto
            dialog.getScene().getStylesheets().add(getClass().getResource("/add-contact.css").toExternalForm());
            dialog.setResizable(false);
            dialog.showAndWait();

            Contact created = dlg.getResult();
            if (created != null) {
                repo.add(created);
                table.getSelectionModel().clearSelection();
                table.getSelectionModel().select(created);
                table.scrollTo(created);
                table.sort();
                updateStats(); // Aggiorna il contatore dopo l'aggiunta
            }
        } catch (Exception e) { showError(e); }
    }

    @FXML private void onDelete() {
        List<Contact> selected = List.copyOf(table.getSelectionModel().getSelectedItems());
        if (selected.isEmpty()) return;

        String msg = selected.size() == 1
                ? "Eliminare il contatto \"" + selected.get(0).getName() + "\"?"
                : "Eliminare i " + selected.size() + " contatti selezionati?";
        Alert alert = new Alert(Alert.AlertType.CONFIRMATION, msg, ButtonType.NO, ButtonType.YES);
        alert.setHeaderText(null);
        alert.showAndWait().ifPresent(bt -> {
            if (bt == ButtonType.YES) {
                repo.findAll().removeAll(selected);
                updateStats(); // Aggiorna il contatore dopo l'eliminazione
            }
        });
    }

    @FXML private void onSelectAll() { table. requestFocus(); table.getSelectionModel().selectAll(); }

    @FXML private void onImportCsv() {
        FileChooser fc = new FileChooser();
        fc.getExtensionFilters().add(new FileChooser.ExtensionFilter("CSV", "*.csv"));
        File f = fc.showOpenDialog(table.getScene().getWindow());
        if (f == null) return;

        try {
            // chiavi esistenti per deduplica
            Set<String> existingKeys = repo.findAll().stream()
                    .map(this::key)
                    .collect(Collectors.toCollection(LinkedHashSet::new));

            var path = Path.of(f.toURI());
            var lines = Files.readAllLines(path, StandardCharsets.UTF_8);
            int added = 0;
            for (int i = 0; i < lines.size(); i++) {
                String line = lines.get(i).trim();
                if (line.isEmpty()) continue;
                if (i == 0 && line.toLowerCase().startsWith("name,phone,email")) continue; // header

                String[] p = splitCsv(line);
                if (p.length < 3) continue;
                Contact c = new Contact(p[0].trim(), p[1].trim(), p[2].trim());
                String k = key(c);
                if (existingKeys.add(k)) {
                    repo.add(c);
                    added++;
                }
            }
            if (added > 0) {
                table.sort();
                updateStats(); // Aggiorna il contatore dopo l'importazione CSV
            }
            toast("Import CSV completato. Aggiunti " + added + " contatti.");
        } catch (Exception e) { showError(e); }
    }

    @FXML private void onExportCsv() {
        FileChooser fc = new FileChooser();
        fc.getExtensionFilters().add(new FileChooser.ExtensionFilter("CSV", "*.csv"));
        fc.setInitialFileName("rubrica.csv");
        File f = fc.showSaveDialog(table.getScene().getWindow());
        if (f == null) return;

        try (var bw = Files.newBufferedWriter(Path.of(f.toURI()), StandardCharsets.UTF_8)) {
            bw.write("name,phone,email"); bw.newLine(); // header
            for (Contact c : repo.findAll()) {
                bw.write(escape(c.getName())); bw.write(',');
                bw.write(escape(c.getPhone())); bw.write(',');
                bw.write(escape(c.getEmail())); bw.newLine();
            }
            toast("Export CSV completato.");
        } catch (Exception e) { showError(e); }
    }

    // ===== Helpers

    private static String safe(String s) { return s == null ? "" : s.trim(); }

    private String key(Contact c) {
        return (safe(c.getName()) + "|" + safe(c.getPhone()) + "|" + safe(c.getEmail())).toLowerCase();
    }

    private static String escape(String s) {
        if (s == null) return "";
        return s.contains(",") ? "\"" + s.replace("\"", "\"\"") + "\"" : s;
    }

    // Splitter CSV minimale con gestione dei campi quotati e delle doppie virgolette
    private static String[] splitCsv(String line) {
        java.util.List<String> out = new java.util.ArrayList<>();
        StringBuilder cur = new StringBuilder();
        boolean inQ = false;
        for (int i = 0; i < line.length(); i++) {
            char ch = line.charAt(i);
            if (ch == '"') {
                if (inQ && i + 1 < line.length() && line.charAt(i + 1) == '"') { cur.append('"'); i++; }
                else inQ = !inQ;
            } else if (ch == ',' && !inQ) {
                out.add(cur.toString()); cur.setLength(0);
            } else cur.append(ch);
        }
        out.add(cur.toString());
        return out.toArray(String[]::new);
    }

    // confronto "numerico se possibile", altrimenti lessicografico case-insensitive
    private static int comparePhone(String a, String b) {
        String sa = a == null ? "" : a.trim();
        String sb = b == null ? "" : b.trim();
        boolean da = sa.matches("\\d+");
        boolean db = sb.matches("\\d+");
        if (da && db) {
            int la = sa.length(), lb = sb.length();
            if (la != lb) return Integer.compare(la, lb);
            return sa.compareTo(sb);
        }
        return sa.compareToIgnoreCase(sb);
    }

    private static String makeInitials(String name) {
        if (name == null || name.isBlank()) return "??";
        var parts = name.trim().split("\\s+");
        String a = parts[0].substring(0,1).toUpperCase();
        String b = parts.length > 1 ? parts[1].substring(0,1).toUpperCase() : "";
        return a + b;
    }
    private static Paint colorFromName(String s) {
        int h = Math.abs(s == null ? 0 : s.hashCode());
        // palette pastello fissa
        Color[] palette = {
                Color.web("#DCE8FF"), Color.web("#FFE3E3"),
                Color.web("#E6F7E6"), Color.web("#FFF1D6"),
                Color.web("#EDE7FF"), Color.web("#E0F3FF")
        };
        return palette[h % palette.length];
    }


    private void showError(Exception e) {
        e.printStackTrace();
        Alert a = new Alert(Alert.AlertType.ERROR, e.getMessage(), ButtonType.OK);
        a.setHeaderText("Errore");
        a.showAndWait();
    }

    private void toast(String text) {
        Alert a = new Alert(Alert.AlertType.INFORMATION, text, ButtonType.OK);
        a.setHeaderText(null);
        a.showAndWait();
    }
}
