package it.unimore.rubrica.model;

import it.unimore.rubrica.util.JsonUtils;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class JsonRepository implements IRepository {

    private final ObservableList<Contact> data = FXCollections.observableArrayList();

    // Salviamo nel profilo utente
    private final Path jsonFile = Path.of("src", "main", "resources", "data", "contacts.json");;
    // Permette di accedere al file
    public Path getPath() { return jsonFile; }


    private static class ContactDTO {
        String name;
        String phone;
        String email;
        ContactDTO() {}
        ContactDTO(String n, String p, String e) { name = n; phone = p; email = e; }
    }
    private static ContactDTO toDTO(Contact c) {
        return new ContactDTO(c.getName(), c.getPhone(), c.getEmail());
    }
    private static Contact fromDTO(ContactDTO d) {
        return new Contact(d.name, d.phone, d.email);
    }


    @Override public ObservableList<Contact> findAll() { return data; }
    @Override public void add(Contact c) { data.add(c); }
    @Override public void remove(Contact c) { data.remove(c); }


    @Override
    public void save() throws IOException {
        Files.createDirectories(jsonFile.getParent());
        var dtoList = data.stream().map(JsonRepository::toDTO).collect(Collectors.toList());
        var json = JsonUtils.GSON.toJson(dtoList);
        Files.writeString(jsonFile, json, StandardCharsets.UTF_8);
    }

    @Override
    public void load() throws IOException {
        if (!Files.exists(jsonFile)) { data.clear(); return; }
        var json = Files.readString(jsonFile, StandardCharsets.UTF_8);
        var type = new com.google.gson.reflect.TypeToken<List<ContactDTO>>(){}.getType();
        List<ContactDTO> dtoList = JsonUtils.GSON.fromJson(json, type);
        if (dtoList == null) { data.clear(); return; }
        var contacts = dtoList.stream().map(JsonRepository::fromDTO).collect(Collectors.toList());
        data.setAll(contacts);

    }

    /***
    public void importCsv(Path csv) throws IOException {
        List<Contact> imported = new ArrayList<>();
        try (BufferedReader br = Files.newBufferedReader(csv, StandardCharsets.UTF_8)) {
            String line;
            while ((line = br.readLine()) != null) {
                if (line.isBlank()) continue;
                String[] p = line.split(",", -1);
                if (p.length < 3) continue;
                imported.add(new Contact(p[0].trim(), p[1].trim(), p[2].trim()));
            }
        }
        data.addAll(imported);
    }

    public void exportCsv(Path csv) throws IOException {
        try (BufferedWriter bw = Files.newBufferedWriter(csv, StandardCharsets.UTF_8)) {
            for (Contact c : data) {
                bw.write(escape(c.getName())); bw.write(',');
                bw.write(escape(c.getPhone())); bw.write(',');
                bw.write(escape(c.getEmail())); bw.newLine();
            }
        }
    }

    private static String escape(String s) {
        if (s == null) return "";
        return s.contains(",") ? "\"" + s.replace("\"", "\"\"") + "\"" : s;
    }
     */
}
