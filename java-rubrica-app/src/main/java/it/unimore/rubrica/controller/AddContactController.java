package it.unimore.rubrica.controller;

import it.unimore.rubrica.model.Contact;
import javafx.fxml.FXML;
import javafx.scene.control.TextField;
import javafx.stage.Stage;

public class AddContactController {
    @FXML private TextField nameField, phoneField, emailField;

    private Contact result;

    public Contact getResult() { return result; }

    @FXML private void onCancel() {
        ((Stage) nameField.getScene().getWindow()).close();
    }

    @FXML private void onCreate() {

            String name = nameField.getText().trim();
            if (name.isEmpty()) {
                if (!nameField.getStyleClass().contains("field-error"))
                    nameField.getStyleClass().add("field-error");
                nameField.requestFocus();
                return;
            } else {
                nameField.getStyleClass().remove("field-error");
            }

            result = new Contact(
                    name,
                    phoneField.getText() == null ? "" : phoneField.getText().trim(),
                    emailField.getText() == null ? "" : emailField.getText().trim()
            );
            ((Stage) nameField.getScene().getWindow()).close();


    }
}
