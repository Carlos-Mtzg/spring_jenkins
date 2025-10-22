package sgu.dev.sgu_cmg_server.modules.user;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import sgu.dev.sgu_cmg_server.modules.user.dto.UserRequestDto;
import sgu.dev.sgu_cmg_server.modules.user.dto.UserResponseDto;
import sgu.dev.sgu_cmg_server.modules.user.dto.UserUpdateDto;
import sgu.dev.sgu_cmg_server.utils.Utilities;

@Service
@RequiredArgsConstructor
public class UserService {

    private final IUserRepository userRepository;

    @Transactional(readOnly = true)
    public ResponseEntity<Object> getAllUsers() {
        List<UserModel> users = userRepository.findAll();
        List<UserResponseDto> userResponse = users.stream()
                .map(user -> UserResponseDto.builder()
                        .uuid(user.getUuid())
                        .fullName(user.getFullName())
                        .email(user.getEmail())
                        .phone(user.getPhone())
                        .build())
                .toList();
        return Utilities.generateResponse(HttpStatus.OK, "Consulta exitosa", userResponse);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Object> getUserByUuid(UUID uuid) {
        Optional<UserModel> userOpt = userRepository.findByUuid(uuid);
        if (!userOpt.isPresent()) {
            return Utilities.simpleResponse(HttpStatus.NOT_FOUND, "Usuario no encontrado");
        }
        UserModel user = userOpt.get();
        UserResponseDto userResponse = UserResponseDto.builder()
                .uuid(user.getUuid())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .build();
        return Utilities.generateResponse(HttpStatus.OK, "Consulta exitosa", userResponse);
    }

    @Transactional
    public ResponseEntity<Object> createUser(UserRequestDto request) {
        try {
            String email = request.getEmail();
            String phone = request.getPhone();
            if (email != null && !email.isBlank() && userRepository.findByEmail(email).isPresent()) {
                return Utilities.simpleResponse(HttpStatus.CONFLICT,
                        "Ya existe un registro con este correo electrónico");
            }

            if (phone != null && !phone.isBlank() && userRepository.findByPhone(phone).isPresent()) {
                return Utilities.simpleResponse(HttpStatus.CONFLICT,
                        "Ya existe un registro con este número de teléfono");
            }

            UUID uuid = UUID.randomUUID();
            UserModel user = UserModel.builder()
                    .uuid(uuid)
                    .fullName(request.getFullName())
                    .email(request.getEmail())
                    .phone(request.getPhone())
                    .createdAt(LocalDate.now())
                    .build();

            userRepository.save(user);
            return Utilities.simpleResponse(HttpStatus.CREATED, "Usuario registrado exitosamente");
        } catch (Exception e) {
            return Utilities.simpleResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Ocurrió un error inesperado");
        }
    }

    @Transactional
    public ResponseEntity<Object> updateUser(UUID uuid, UserUpdateDto dto) {
        try {
            return userRepository.findByUuid(uuid)
                    .map(existingUser -> {
                        if (dto.getFullName() != null) {
                            String newFull = dto.getFullName();
                            if (!newFull.equals(existingUser.getFullName())) {
                                existingUser.setFullName(newFull);
                            }
                        }
                        if (dto.getEmail() != null) {
                            String newEmail = dto.getEmail();
                            if (!newEmail.equals(existingUser.getEmail())) {
                                Optional<UserModel> userOpt = userRepository.findByEmail(newEmail);
                                if (userOpt.isPresent() && !userOpt.get().getUuid().equals(existingUser.getUuid())) {
                                    return Utilities.simpleResponse(HttpStatus.CONFLICT,
                                            "Ya hay un usuario registrado con este correo electrónico");
                                }
                                existingUser.setEmail(newEmail);
                            }
                        }
                        if (dto.getPhone() != null) {
                            String newPhone = dto.getPhone();
                            if (!newPhone.equals(existingUser.getPhone())) {
                                Optional<UserModel> userOpt = userRepository.findByPhone(newPhone);
                                if (userOpt.isPresent() && !userOpt.get().getUuid().equals(existingUser.getUuid())) {
                                    return Utilities.simpleResponse(HttpStatus.CONFLICT,
                                            "Ya hay un usuario registrado con este número de teléfono");
                                }
                                existingUser.setPhone(newPhone);
                            }
                        }

                        userRepository.save(existingUser);
                        return Utilities.simpleResponse(HttpStatus.OK, "El usuario se actualizó correctamente");
                    }).orElseGet(() -> Utilities.simpleResponse(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        } catch (org.springframework.dao.DataIntegrityViolationException dive) {
            return Utilities.simpleResponse(HttpStatus.CONFLICT, "Email o teléfono ya registrado");
        } catch (Exception e) {
            return Utilities.simpleResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Ocurrió un error inesperado");
        }
    }

    @Transactional
    public ResponseEntity<Object> deleteUser(UUID uuid) {
        try {
            Optional<UserModel> userOpt = userRepository.findByUuid(uuid);
            if (!userOpt.isPresent()) {
                return Utilities.simpleResponse(HttpStatus.NOT_FOUND, "Usuario no encontrado");
            }
            UserModel user = userOpt.get();
            userRepository.delete(user);
            return Utilities.simpleResponse(HttpStatus.OK, "El usuario se eliminó correctamente");
        } catch (Exception e) {
            return Utilities.simpleResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Ocurrió un error inesperado");
        }
    }
}
