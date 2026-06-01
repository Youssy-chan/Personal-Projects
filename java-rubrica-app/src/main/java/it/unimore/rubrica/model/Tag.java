package it.unimore.rubrica.model;

public class Tag {
    private String name;
    private String colorHex; // es. "#2196f3"

    public Tag() {}
    public Tag(String name, String colorHex) { this.name = name; this.colorHex = colorHex; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getColorHex() { return colorHex; }
    public void setColorHex(String colorHex) { this.colorHex = colorHex; }

    @Override public String toString() { return name; }
}
