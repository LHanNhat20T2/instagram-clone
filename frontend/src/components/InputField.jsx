import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PropTypes from "prop-types";

const InputField = ({
    label,
    type = "text",
    name,
    register,
    errors = {},
    validation = {},
    placeholder = "",
}) => {
    return (
        <div className="text-left">
            <Label className="text-base font-medium">{label}</Label>
            <Input
                type={type}
                className="my-2 focus-visible:ring-transparent"
                {...register(name, validation)}
                placeholder={placeholder}
            />
            {errors[name] && (
                <p className="text-sm text-red-500">{errors[name].message}</p>
            )}
        </div>
    );
};

InputField.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string,
    name: PropTypes.string.isRequired,
    register: PropTypes.func.isRequired,
    errors: PropTypes.object,
    validation: PropTypes.object,
    placeholder: PropTypes.string,
};

export default InputField;
