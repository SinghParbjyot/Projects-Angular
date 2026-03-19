package com.springboot.backend.singh.usersapp.users_backend.controllers;

import org.springframework.web.bind.annotation.RestController;

import com.springboot.backend.singh.usersapp.users_backend.entities.User;
import com.springboot.backend.singh.usersapp.users_backend.models.UserRequest;
import com.springboot.backend.singh.usersapp.users_backend.services.UserService;

import jakarta.validation.Valid;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PutMapping;

//Ruta para permitir peticiones desde el front
@CrossOrigin(originPatterns = { "http://localhost:4200" })
// Indica que esta clase es un controlador donde cada método devuelve un objeto
// serializado (JSON)
@RestController
// Ruta base para todos los endpoints de este controlador
@RequestMapping("/api/users")

/**
 * Clase controlador aqui manejamos todos los metodos del service es decir aqui
 * recibimos las peticiones HttpClient las procesamos , llamamos a la base de
 * datos para
 * que nos devuelva una respuesta y devolvemos la respuesta de devuelta al front
 */
public class UserController {

    @Autowired
    // Inyección de la capa de servicio (Lógica de negocio)

    private UserService service;

    @GetMapping
    /**
     * Listar todos los usuarios.
     * 
     * @return Lista completa de usuarios en formato JSON.
     */
    public List<User> list() {
        return service.findAll();
    }

    /**
     * 
     * @param id
     * @return devuelve un 200 si es existoso y sino un 404 con un el id no
     *         encontrado
     *         Response Entity devuelve la repuesta en funcion de si se ha
     *         encontrado un usuario o no
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> show(@PathVariable Long id) {

        Optional<User> userOptional = service.findById(id);
        if (userOptional.isPresent()) {
            return ResponseEntity.ok(userOptional.orElseThrow());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Collections.singletonMap("Error", "El usuario no se encontro por el id " + id));
    }

    @PostMapping
    /**
     * Crear un nuevo usuario.
     * 
     * @param user   Objeto usuario enviado en el cuerpo de la petición.
     * @param result Captura errores de validación definidos en la entidad User.
     * @return Usuario creado (201 CREATED) o lista de errores (400 BAD REQUEST).
     */
    public ResponseEntity<?> create(@Valid @RequestBody User user, BindingResult result) {
        if (result.hasErrors()) {
            return validation(result);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(user));
    }

    @GetMapping("/page/{page}")
    /**
     * Listado paginado de usuarios.
     * 
     * @param page Número de la página que se solicita (inicia en 0).
     * @return Objeto Page con los datos de los usuarios y metadatos de paginación.
     */
    public Page<User> listPageable(@PathVariable Integer page) {
        Pageable pageable = PageRequest.of(page, 3);
        return service.findAll(pageable);
    }

    @PutMapping("/{id}")
    /**
     * Actualizar un usuario existente.
     * 
     * @param user   Datos actualizados.
     * @param result Captura errores de validación.
     * @param id     ID del usuario a modificar.
     * @return Usuario actualizado (200 OK) o error (404 NOT FOUND / 400 BAD
     *         REQUEST).
     */
    public ResponseEntity<?> update(@Valid @RequestBody UserRequest userRequest, BindingResult result, @PathVariable Long id) {
        if (result.hasErrors()) {
            return validation(result);
        }
        Optional<User> userOptional = service.update(userRequest, id);
        if (userOptional.isPresent()) {
            return ResponseEntity.ok(userOptional.orElseThrow());
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    /**
     * Eliminar un usuario.
     * 
     * @param id ID del usuario a borrar.
     * @return 204 NO CONTENT si se borró con éxito o 404 NOT FOUND si no existía.
     */
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Optional<User> userOptional = service.findById(id);
        if (userOptional.isPresent()) {
            service.deleteById(id);
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }

    /**
     * Método auxiliar para formatear los mensajes de error de validación.
     * Convierte los errores de BindingResult en un Map amigable para el Front-end.
     */
    private ResponseEntity<?> validation(BindingResult result) {
        Map<String, String> errors = new HashMap<String, String>();
        result.getFieldErrors().forEach(error -> {
            errors.put(error.getField(), "El campo " + error.getField() + " " + error.getDefaultMessage());
        });
        return ResponseEntity.badRequest().body(errors);
    }
}
