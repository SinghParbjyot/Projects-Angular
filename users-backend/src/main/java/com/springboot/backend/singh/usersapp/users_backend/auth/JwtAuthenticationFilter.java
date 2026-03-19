package com.springboot.backend.singh.usersapp.users_backend.auth;

import java.io.IOException;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import static com.springboot.backend.singh.usersapp.users_backend.auth.TokenJwtConfig.*;

import com.springboot.backend.singh.usersapp.users_backend.entities.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;

/**
 * Clase que se encarga de recibir las peteciones de inicio de sesion por POST
 * Hereda de UsernamePasswordAuthenticationFilter, que es el filtro estándar de
 * Spring para procesar el login.
 */
public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
    // El AuthenticationManager valida las credenciales
    private AuthenticationManager authenticationManager;

    public JwtAuthenticationFilter(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;

    }

    @Override
    /**
     * Metodo que se ejecuta cuando el usuario intenta hacer login, lee los datos
     * en JSON y se los pasa al AuthenticationManager
     */
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {
        String username = null;
        String password = null;

        try {
            User user = new ObjectMapper().readValue(request.getInputStream(), User.class);
            username = user.getUsername();
            password = user.getPassword();
        } catch (JacksonException | IOException e) {

            e.printStackTrace();
        }
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username,
                password);
        return this.authenticationManager.authenticate(authenticationToken);
    }

    /**
     * 
     * Si el AuthenticationManager es un codigo 200, este método se ejecuta
     * automáticamente.
     * Aquí es donde creamos el Token JWT y se lo entregamos al cliente.
     */
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
            Authentication authResult) throws IOException, ServletException {
        org.springframework.security.core.userdetails.User user = (org.springframework.security.core.userdetails.User) authResult
                .getPrincipal();
        String username = user.getUsername();

        // Metodos que sirven para reocger los roles y luego los mostramos en la ruta
        Collection<? extends GrantedAuthority> roles = authResult.getAuthorities();
        boolean isAdmin = roles.stream().anyMatch(role -> role.getAuthority().equals("ROLE_ADMIN"));
        Claims claims = Jwts.claims().add("authorities", new ObjectMapper().writeValueAsString(roles))
                .add("username", username)
                .add("isAdmin",isAdmin)
                .build();

        // aqui firmamos el token con la llave secreta
        String jwt = Jwts.builder().subject(username).claims(claims).signWith(SECRET_KEY).issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 3600000)).compact();

        // header de la respuesta
        response.addHeader(HEADER_AUTHORIZATION, PREFIX_TOKEN + jwt);

        // body de la respuesta mandamos el token, username y un mensaje de exito
        Map<String, String> body = new HashMap<>();
        body.put("token", jwt);
        body.put("username", username);
        body.put("message", String.format("Hola %s has inciado sesion con exito", username));

        // setea la respuesta para enviarla al cliente
        response.setContentType(CONTENT_TYPE);

        // status del la respuesta 200 exito
        response.setStatus(200);
        // escribimos en la respuesta el body utilizamos el objectmapper para parsear de
        // objeto a string
        response.getWriter().write(new ObjectMapper().writeValueAsString(body));
    }

    @Override
    /**
     *
     * Si el usuario puso mal la contraseña o el usuario no existe, se ejecuta este
     * método.
     * Sirve para personalizar el mensaje de error que recibe el cliente (un 401 en
     * JSON).
     */
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException failed) throws IOException, ServletException {

            Map<String,String> body = new HashMap<>();
            body.put("message", "Error en la autenticacion con username o password incorrecto");
            body.put("Error", failed.getMessage());
            response.getWriter().write(new ObjectMapper().writeValueAsString(body));
            response.setContentType(CONTENT_TYPE);
            response.setStatus(401);
    }

}
