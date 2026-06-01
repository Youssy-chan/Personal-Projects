package it.unimore.rubrica.model;

import javafx.beans.property.*;


public class Contact {
    private final StringProperty name = new SimpleStringProperty("");
    private final StringProperty phone = new SimpleStringProperty("");
    private final StringProperty email = new SimpleStringProperty("");
     final ObjectProperty<Tag> tag = new SimpleObjectProperty<>(new Tag("Nessuno", "#9e9e9e"));

    public Contact(String name, String trim, String trimmed, String s) {}
    public Contact(String name, String phone, String email) {
        setName(name); setPhone(phone); setEmail(email);
    }

    // properties (per binding in JavaFX)
    public StringProperty nameProperty() { return name; }
    public StringProperty phoneProperty() { return phone; }
    public StringProperty emailProperty() { return email; }
    public ObjectProperty<Tag> tagProperty() { return tag; }

    public String getName() { return name.get(); }
    public void setName(String v) { name.set(v); }
    public String getPhone() { return phone.get(); }
    public void setPhone(String v) { phone.set(v); }
    public String getEmail() { return email.get(); }
    public void setEmail(String v) { email.set(v); }

    public Tag getTag() { return tag.get(); }
    public void setTag(Tag v) { tag.set(v); }

    @Override public String toString() { return getName() + " (" + getPhone() + ")"; }
}
