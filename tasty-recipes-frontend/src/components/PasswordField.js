import React, { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { Eye, EyeSlash } from 'react-bootstrap-icons'; // or use your preferred icon library

const PasswordField = ({ label, value, onChange, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <InputGroup>
        <Form.Control
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder || "Enter password"}
          required
        />
        <InputGroup.Text 
          onClick={togglePasswordVisibility}
          style={{ cursor: 'pointer' }}
        >
          {showPassword ? <EyeSlash /> : <Eye />}
        </InputGroup.Text>
      </InputGroup>
    </Form.Group>
  );
};

export default PasswordField;