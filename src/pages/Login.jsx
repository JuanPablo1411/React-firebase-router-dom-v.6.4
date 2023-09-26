import { Formik } from "formik";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../config/firebase";
import { useUserContext } from "../context/UserContext";
import * as Yup from "yup";

import { Avatar, Box, Button, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const Login = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user]);

  const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
    try {
      await login({ email: values.email, password: values.password });
      console.log("user logged in");
      resetForm();
    } catch (error) {
      console.log(error.code);
      console.log(error.message);
      if (error.code === "auth/user-not-found") {
        setErrors({ email: "Email already in use" });
      }
      if (error.code === "auth/wrong-password") {
        setErrors({ password: "Wrong password" });
      }
    } finally {
      setSubmitting(false);
    }
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Email no valido").required("Email requerido"),
    password: Yup.string()
      .trim()
      .min(6, "Minimo 6 caracteres")
      .required("Password requerido"),
  });

  return (
    <Box sx={{ mt: 8, maxWidth: "400px", mx: "auto", textAlign: "center" }}>
      <Avatar sx={{ mx: "auto", bgcolor: "#111" }}>
        <LockOutlinedIcon />
      </Avatar>

      <Typography variant="h5" component="h1">
        Sign in
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
          <Box onSubmit={handleSubmit} sx={{ mt: 1 }} component="form">
            <TextField
              type="text"
              placeholder="email@example.com"
              value={values.email}
              onChange={handleChange}
              name="email"
              onBlur={handleBlur}
              id="email"
              label="Ingrese-email"
              fullWidth
              sx={{ mb: 3 }}
              error={errors.email && touched.email}
              helperText={errors.email && touched.email && errors.email}
            />

            <TextField
              type="password"
              placeholder="password"
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
              Login
            </LoadingButton>

            <Button fullWidth component={Link} to="/register">
              Don't have an account? Sign up
            </Button>
          </Box>
        )}
      </Formik>
    </Box>
  );
};

export default Login;
