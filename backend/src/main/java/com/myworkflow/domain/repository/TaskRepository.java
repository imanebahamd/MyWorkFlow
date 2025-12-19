package com.myworkflow.domain.repository;

import com.myworkflow.domain.model.Project;
import com.myworkflow.domain.model.Task;
import com.myworkflow.domain.model.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    Page<Task> findByProject(Project project, Pageable pageable);

    List<Task> findByProjectAndStatus(Project project, TaskStatus status);

    long countByProject(Project project);

    long countByProjectAndStatus(Project project, TaskStatus status);

    @Query("SELECT t FROM Task t WHERE t.project = :project AND " +
            "(LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Task> findByProjectAndSearch(@Param("project") Project project,
                                      @Param("search") String search,
                                      Pageable pageable);

    @Query("SELECT t FROM Task t WHERE t.project = :project AND " +
            "(:status IS NULL OR t.status = :status) AND " +
            "(:dueDate IS NULL OR t.dueDate = :dueDate)")
    Page<Task> findByProjectAndFilters(@Param("project") Project project,
                                       @Param("status") TaskStatus status,
                                       @Param("dueDate") LocalDate dueDate,
                                       Pageable pageable);
}