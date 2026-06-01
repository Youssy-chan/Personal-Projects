package it.unimore.rubrica;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class MainApp extends Application {
    @Override
    public void start(Stage stage) throws Exception {
        Parent root = FXMLLoader.load(getClass().getResource("/view/main.fxml"));
        var scene = new Scene(root, 700, 450);
        stage.setTitle("Rubrica");
        //stage.getIcons().add(new Image(getClass().getResourceAsStream("/icon.png"))); // opzionale
        scene.getStylesheets().add(getClass().getResource("/app.css").toExternalForm());
        stage.setScene(scene);
        stage.show();
    }
    public static void main(String[] args) { launch(args); }
}
