package com.myworkflow.domain.repository;

import com.myworkflow.domain.model.Project;
import com.myworkflow.domain.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    Page<Project> findByUser(User user, Pageable pageable);

    @Query("SELECT p FROM Project p WHERE p.user = :user AND " +
            "(LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Project> findByUserAndSearch(@Param("user") User user,
                                      @Param("search") String search,
                                      Pageable pageable);

    boolean existsByIdAndUser(Long id, User user);
}