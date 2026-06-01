package it.unimore.rubrica.model;

import javafx.collections.ObservableList;

public interface IRepository {
    ObservableList<Contact> findAll();
    void add(Contact c);
    void remove(Contact c);
    void save() throws Exception;
    void load() throws Exception;   // carica dati
}
