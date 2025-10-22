package sgu.dev.sgu_cmg_server.modules.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserRequestDto {

    public static final String NO_ANGLE_BRACKETS_MESSAGE = "No se permiten los caracteres < o >";
    public static final String NO_ANGLE_BRACKETS_REGEX = "^[^<>]*$";
    public static final String NOT_NULL_MESSAGE = "Este campo es obligatorio";

    @NotNull(message = NOT_NULL_MESSAGE)
    @Pattern(regexp = NO_ANGLE_BRACKETS_REGEX, message = NO_ANGLE_BRACKETS_MESSAGE)
    private String fullName;

    @Email(message = "El formato del correo electrónico es inválido")
    @NotNull(message = NOT_NULL_MESSAGE)
    @Pattern(regexp = NO_ANGLE_BRACKETS_REGEX, message = NO_ANGLE_BRACKETS_MESSAGE)
    private String email;

    @NotNull(message = NOT_NULL_MESSAGE)
    @Pattern(regexp = NO_ANGLE_BRACKETS_REGEX, message = NO_ANGLE_BRACKETS_MESSAGE)
    private String phone;

    public void setFullName(String fullName) {
        this.fullName = fullName != null ? fullName.trim() : null;
    }

    public void setEmail(String email) {
        this.email = email != null ? email.trim() : null;
    }

    public void setPhone(String phone) {
        this.phone = phone != null ? phone.trim() : null;
    }

}
