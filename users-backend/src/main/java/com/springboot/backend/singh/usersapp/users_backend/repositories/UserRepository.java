package com.springboot.backend.singh.usersapp.users_backend.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.springboot.backend.singh.usersapp.users_backend.entities.User;

@Repository
//Interfaz que hereda de CrudRepository que implementa metodos especificos de CRUD
// para que la entity los use 
public interface UserRepository extends CrudRepository<User,Long> {
        
    Page<User> findAll(Pageable pageable);

    Optional<User> findByUsername(String name);
}
