module it.unimore.rubrica {
    requires javafx.controls;
    requires javafx.fxml;
    requires javafx.graphics;
    requires com.google.gson;
    requires javafx.base;

    opens it.unimore.rubrica.controller to javafx.fxml;
    opens it.unimore.rubrica.model to com.google.gson, javafx.base;
    opens it.unimore.rubrica to javafx.graphics, javafx.fxml;

    exports it.unimore.rubrica;
    exports it.unimore.rubrica.controller;
    exports it.unimore.rubrica.model;


}
