package com.example.user_account_service.repository;

import com.example.user_account_service.model.account;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface accountRepository extends JpaRepository<account,Long>{
    
    List<account> findByUserId(Long userId);

    // check existence by account number
    boolean existsByAccountNumber(String accountNumber);
    
}
