package sgu.dev.sgu_cmg_server.modules.user;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import sgu.dev.sgu_cmg_server.modules.user.dto.UserRequestDto;
import sgu.dev.sgu_cmg_server.modules.user.dto.UserUpdateDto;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("")
    public ResponseEntity<Object> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{uuid}")
    public ResponseEntity<Object> getUserByUuid(@PathVariable("uuid") UUID uuid) {
        return userService.getUserByUuid(uuid);
    }

    @PostMapping("")
    public ResponseEntity<Object> createUser(@RequestBody @Valid UserRequestDto request) {
        return userService.createUser(request);
    }

    @PutMapping("/{uuid}")
    public ResponseEntity<Object> updateUser(@PathVariable("uuid") UUID uuid, @RequestBody @Valid UserUpdateDto dto) {
        return userService.updateUser(uuid, dto);
    }

    @DeleteMapping("/{uuid}")
    public ResponseEntity<Object> deleteUser(@PathVariable("uuid") UUID uuid) {
        return userService.deleteUser(uuid);
    }
}
