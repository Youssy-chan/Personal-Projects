package it.unimore.rubrica.model;

import javafx.collections.FXCollections;
import javafx.collections.ObservableList;

public class InMemoryRepository implements IRepository {

    private final ObservableList<Contact> data = FXCollections.observableArrayList();

    public InMemoryRepository() {
        // seed di prova
        data.add(new Contact("Mario Rossi", "3331234567", "mario@ex.com", "Amico"));
        data.add(new Contact("Grazia Bianchi", "3209876543", "grazia@ex.com", "Amico"));
    }

    @Override public ObservableList<Contact> findAll() { return data; }
    @Override public void add(Contact c) { data.add(c); }
    @Override public void remove(Contact c) { data.remove(c); }
    @Override public void save() { /* no-op per memoria */ }
    @Override public void load() { /* no-op */ }
}
