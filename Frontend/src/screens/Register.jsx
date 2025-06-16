import React, { useState } from 'react';
import '../styles/Register.css';

const Register = () => {
  const [userType, setUserType] = useState(null);
  const [hasMedicalConditions, setHasMedicalConditions] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    city: '',
    state: '',
    cref: '',
    goal: '',
    medicalConditions: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados do cadastro:', { userType, ...formData });
  };

  return (
    <div className="aptus-signup-container">
      <div className="aptus-signup-card">

        <div className="aptus-signup-header">
          <div className="aptus-logo">
            <span className="aptus-logo-icon">AF</span>
            <span className="aptus-logo-text">AptusFlow</span>
          </div>
          <h1 className="aptus-signup-title">Crie sua conta</h1>
          <p className="aptus-signup-subtitle">Selecione seu tipo de perfil para começar</p>
        </div>

      
        <div className="aptus-user-type-selector">
          <button
            className={`aptus-type-option ${userType === 'personal' ? 'aptus-type-active' : ''}`}
            onClick={() => setUserType('personal')}
          >
            <span className="aptus-type-icon">👨‍⚕️</span>
            <span className="aptus-type-label">Personal Trainer</span>
          </button>
          <button
            className={`aptus-type-option ${userType === 'student' ? 'aptus-type-active' : ''}`}
            onClick={() => setUserType('student')}
          >
            <span className="aptus-type-icon">🏋️</span>
            <span className="aptus-type-label">Aluno</span>
          </button>
        </div>

        {userType && (
          <form onSubmit={handleSubmit} className="aptus-signup-form">
            {/* Seção de Informações Básicas */}
            <div className="aptus-form-section">
              <h3 className="aptus-section-title">Informações Básicas</h3>
              <div className="aptus-form-group">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nome Completo"
                  className="aptus-input"
                  required
                />
                <span className="aptus-input-border"></span>
              </div>

              <div className="aptus-form-group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="aptus-input"
                  required
                />
                <span className="aptus-input-border"></span>
              </div>

              <div className="aptus-form-row">
                <div className="aptus-form-group">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Senha"
                    className="aptus-input"
                    required
                  />
                  <span className="aptus-input-border"></span>
                </div>
                <div className="aptus-form-group">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirmar Senha"
                    className="aptus-input"
                    required
                  />
                  <span className="aptus-input-border"></span>
                </div>
              </div>
            </div>

            {/* Seção Específica por Tipo */}
            <div className="aptus-form-section">
              <h3 className="aptus-section-title">
                {userType === 'personal' ? 'Informações Profissionais' : 'Objetivos'}
              </h3>

              {userType === 'personal' ? (
                <>
                  <div className="aptus-form-row">
                    <div className="aptus-form-group">
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Cidade"
                        className="aptus-input"
                        required
                      />
                      <span className="aptus-input-border"></span>
                    </div>
                    <div className="aptus-form-group">
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="Estado (UF)"
                        className="aptus-input"
                        maxLength="2"
                        required
                      />
                      <span className="aptus-input-border"></span>
                    </div>
                  </div>
                  <div className="aptus-form-group">
                    <input
                      type="text"
                      name="cref"
                      value={formData.cref}
                      onChange={handleInputChange}
                      placeholder="Número do CREF"
                      className="aptus-input"
                      required
                    />
                    <span className="aptus-input-border"></span>
                  </div>
                </>
              ) : (
                <>
                  <div className="aptus-form-group">
                    <select
                      name="goal"
                      value={formData.goal}
                      onChange={handleInputChange}
                      className="aptus-select"
                      required
                    >
                      <option value="">Selecione seu objetivo principal</option>
                      <option value="weight-loss">Perda de Peso</option>
                      <option value="muscle-gain">Ganho de Massa Muscular</option>
                      <option value="fitness">Condicionamento Físico</option>
                      <option value="rehabilitation">Reabilitação</option>
                      <option value="performance">Melhoria de Performance</option>
                    </select>
                    <span className="aptus-input-border"></span>
                  </div>

                  <div className="aptus-medical-conditions">
                    <label className="aptus-checkbox-label">
                      <input
                        type="checkbox"
                        checked={hasMedicalConditions}
                        onChange={(e) => setHasMedicalConditions(e.target.checked)}
                        className="aptus-checkbox"
                      />
                      <span className="aptus-checkbox-custom"></span>
                      Possui condições médicas que possam limitar sua atividade física?
                    </label>
                    {hasMedicalConditions && (
                      <div className="aptus-form-group">
                        <textarea
                          name="medicalConditions"
                          value={formData.medicalConditions}
                          onChange={handleInputChange}
                          placeholder="Descreva detalhadamente suas condições médicas..."
                          className="aptus-textarea"
                          rows="3"
                        />
                        <span className="aptus-input-border"></span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <button type="submit" className="aptus-signup-button">
              Criar Conta
              <span className="aptus-button-icon">→</span>
            </button>

            <div className="aptus-login-link">
              Já possui uma conta? <a href="#login" className="aptus-link">Faça login</a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;