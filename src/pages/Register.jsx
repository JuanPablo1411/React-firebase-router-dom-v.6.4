import { Formik } from "formik";
import * as Yup from "yup";
import { register } from "../config/firebase";
import { useUserContext } from "../context/UserContext";
import { useRedirectActiveUser } from "../hooks/useRedirectActiveUser";

import { Avatar, Box, Button, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link } from "react-router-dom";

const Register = () => {
  const { user } = useUserContext();

  // alternativa con hook
  useRedirectActiveUser(user, "/dashboard");

  const onSubmit = async (
    { email, password },
    { setSubmitting, setErrors, resetForm }
  ) => {
    try {
      await register({ email, password });
      console.log("user registered");
      resetForm();
    } catch (error) {
      console.log(error.code);
      console.log(error.message);
      if (error.code === "auth/email-already-in-use") {
        setErrors({ email: "Email already in use" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().trim().min(6).required(),
  });

  return (
    <Box sx={{ mt: 8, maxWidth: "400px", mx: "auto", textAlign: "center" }}>
      <Avatar sx={{ mx: "auto", bgcolor: "#444" }}>
        <LockOutlinedIcon />
      </Avatar>

      <Typography variant="h5" component="h1">
        Sign up
      </Typography>

      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({
          handleSubmit,
          handleChange,
          values,
          isSubmitting,
          errors,
          touched,
          handleBlur,
        }) => (
          <Box onSubmit={handleSubmit} component="form" sx={{ mt: 1 }}>
            <TextField
              type="text"
              label="Ingrese email"
              value={values.email}
              onChange={handleChange}
              name="email"
              fullWidth
              sx={{ mb: 3 }}
              id="email"
              placeholder="test@example.com"
              onBlur={handleBlur}
              error={errors.email && touched.email}
              helperText={errors.email && touched.email && errors.email}
            />

            <TextField
              type="password"
              placeholder="Ingrese contraseña"
              value={values.password}
              onChange={handleChange}
              name="password"
              onBlur={handleBlur}
              id="password"
              label="Ingrese contraseña"
              fullWidth
              sx={{ mb: 3 }}
              error={errors.password && touched.password}
              helperText={
                errors.password && touched.password && errors.password
              }
            />

            <LoadingButton
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
              variant="contained"
              fullWidth
              sx={{ mb: 3 }}
            >
              Register
            </LoadingButton>
            <Button component={Link} to="/" fullWidth>
              ¿Ya tienes cuenta? Ingresa
            </Button>
          </Box>
        )}
      </Formik>
    </Box>
  );
};

export default Register;
