package sgu.dev.sgu_cmg_server.modules.user;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IUserRepository extends JpaRepository<UserModel, Long> {
    Optional<UserModel> findByUuid(UUID uuid);

    Optional<UserModel> findByEmail(String email);

    Optional<UserModel> findByPhone(String phone);
}
