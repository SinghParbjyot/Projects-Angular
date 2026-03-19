package com.springboot.backend.singh.usersapp.users_backend.services;

import java.util.List; 
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.springboot.backend.singh.usersapp.users_backend.entities.User;
import com.springboot.backend.singh.usersapp.users_backend.repositories.UserRepository;

@Service// Aqui indicamos que es una clase de tipo servicio
//Clase que contiene el servicio que llama a la base de datos para recoger los datos del usuario

public class JpaUserDetailsService  implements UserDetailsService{

    @Autowired
    private UserRepository repository;

    /**
     * @Transactional(readOnly = true) es vital aquí porque:
     * 1. Mantiene la sesión de Hibernate abierta para cargar los roles (que son Lazy).
     * 2. Optimiza el rendimiento al ser una consulta de solo lectura.
     */
    @Transactional(readOnly = true)
    @Override
    /**
     * Metodo que busca el usuario en la bd si es un codigo 200 , entonces retorna 
     * los detalles del usuario y sino hace un throw de que no se ha encontrado
     */
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> optionalUser = repository.findByUsername(username);
        if (optionalUser.isEmpty()) {
            throw new UsernameNotFoundException(String.format("Username %s no se ha  encontrado",username));
        }
        User user = optionalUser.orElseThrow();
        List<GrantedAuthority> authorities = user.getRoles().stream().map(role -> new SimpleGrantedAuthority(role.getName())).collect(Collectors.toList());
        return new org.springframework.security.core.userdetails.User(username,
            user.getPassword(),
            true,
            true,
            true,
            true,
            authorities
        );
    }

}
