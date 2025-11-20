package com.example.user_account_service.service;

import com.example.user_account_service.repository.userRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.user_account_service.model.user;

@Service
public class userService {
    
    @Autowired
    private userRepository userRepository;
    
    //POST
    public user createUser(user user){  
        return userRepository.save(user);
    }

    //GET from a list of users
    public List<user> getUsers(){
        return userRepository.findAll();
    }

    //GET from user (self)
    public Optional<user> getUserSelf(long id){
        if (!userRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        return userRepository.findById(id);
    }

    //PUT
    public user updateUser(user user, long id){
        user updatedEmployee = userRepository.findById(id).get();
        updatedEmployee.setName(user.getName());
        updatedEmployee.setEmail(user.getEmail());
        updatedEmployee.setPhone(user.getPhone());

        return userRepository.save(updatedEmployee);
    }

    //DELETE
    public void deleteUser(long id){
        if (!userRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        userRepository.deleteById(id);
    }

}
