package sgu.dev.sgu_cmg_server.modules.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserUpdateDto {

    public static final String NO_ANGLE_BRACKETS_MESSAGE = "No se permiten los caracteres < o >";
    public static final String NO_ANGLE_BRACKETS_REGEX = "^[^<>]*$";

    public static final String PHONE_MESSAGE = "Teléfono inválido. Sólo dígitos (opcional '+' al inicio), 7-15 caracteres, sin < ni >";
    public static final String PHONE_REGEX = "^(?!.*[<>])[+]?[0-9]{7,15}$";

    @Pattern(regexp = NO_ANGLE_BRACKETS_REGEX, message = NO_ANGLE_BRACKETS_MESSAGE)
    private String fullName;

    @Email(message = "El formato del correo electrónico es inválido")
    @Pattern(regexp = NO_ANGLE_BRACKETS_REGEX, message = NO_ANGLE_BRACKETS_MESSAGE)
    private String email;

    @Pattern(regexp = PHONE_REGEX, message = PHONE_MESSAGE)
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
