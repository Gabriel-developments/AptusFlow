import React, { useState } from 'react';
import '../styles/ProfessionalsList.css';

const ProfessionalsList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const professionals = [
    { _id: '1', name: 'Carlos Silva', email: 'carlos@aptus.com', CREF: '123456-G/SP', UF: 'SP', town: 'São Paulo', specialties: ['Musculação', 'Emagrecimento', 'Condicionamento'], rating: 4.8, experience: 8, availability: { workDays: [1,2,3,4,5], startHour: 8, endHour: 18 } },
    { _id: '2', name: 'Ana Paula Souza', email: 'ana@aptus.com', CREF: '654321-G/RJ', UF: 'RJ', town: 'Rio de Janeiro', specialties: ['Pilates', 'Reabilitação', 'Postura'], rating: 4.9, experience: 10, availability: { workDays: [2,3,4,5,6], startHour: 7, endHour: 19 } },
    { _id: '3', name: 'Marcos Oliveira', email: 'marcos@aptus.com', CREF: '789012-G/MG', UF: 'MG', town: 'Belo Horizonte', specialties: ['Crossfit', 'Funcional', 'HIIT'], rating: 4.7, experience: 6, availability: { workDays: [1,3,5,6], startHour: 9, endHour: 17 } },
    { _id: '4', name: 'Juliana Costa', email: 'juliana@aptus.com', CREF: '345678-G/RS', UF: 'RS', town: 'Porto Alegre', specialties: ['Yoga', 'Meditação', 'Alongamento'], rating: 4.5, experience: 5, availability: { workDays: [1,2,4,5,6], startHour: 6, endHour: 15 } },
    { _id: '5', name: 'Fernando Santos', email: 'fernando@aptus.com', CREF: '901234-G/PR', UF: 'PR', town: 'Curitiba', specialties: ['Levantamento de Peso', 'Powerlifting'], rating: 4.6, experience: 7, availability: { workDays: [1,2,3,4,5,6], startHour: 10, endHour: 20 } },
    { _id: '6', name: 'Patrícia Lima', email: 'patricia@aptus.com', CREF: '567890-G/SC', UF: 'SC', town: 'Florianópolis', specialties: ['Dança', 'Zumba', 'Cardio'], rating: 4.8, experience: 9, availability: { workDays: [1,3,5], startHour: 8, endHour: 16 } },
    { _id: '7', name: 'Ricardo Almeida', email: 'ricardo@aptus.com', CREF: '112233-G/DF', UF: 'DF', town: 'Brasília', specialties: ['Corrida', 'Triathlon', 'Resistência'], rating: 4.9, experience: 12, availability: { workDays: [2,4,6], startHour: 6, endHour: 14 } },
    { _id: '8', name: 'Camila Rocha', email: 'camila@aptus.com', CREF: '445566-G/BA', UF: 'BA', town: 'Salvador', specialties: ['Alongamento', 'Flexibilidade', 'Mobilidade'], rating: 4.7, experience: 5, availability: { workDays: [1,2,3,4,5], startHour: 9, endHour: 18 } },
    { _id: '9', name: 'Roberto Nunes', email: 'roberto@aptus.com', CREF: '778899-G/PE', UF: 'PE', town: 'Recife', specialties: ['Boxe', 'Artes Marciais', 'Defesa Pessoal'], rating: 4.8, experience: 8, availability: { workDays: [1,3,5], startHour: 10, endHour: 20 } },
    { _id: '10', name: 'Luana Mendes', email: 'luana@aptus.com', CREF: '334455-G/CE', UF: 'CE', town: 'Fortaleza', specialties: ['Ginástica', 'Acrobacias', 'Alongamento'], rating: 4.6, experience: 6, availability: { workDays: [2,4,6], startHour: 7, endHour: 16 } },
    { _id: '11', name: 'Gustavo Henrique', email: 'gustavo@aptus.com', CREF: '667788-G/GO', UF: 'GO', town: 'Goiânia', specialties: ['Calistenia', 'Street Workout', 'Movimento'], rating: 4.9, experience: 7, availability: { workDays: [1,2,3,4,5], startHour: 6, endHour: 15 } },
    { _id: '12', name: 'Tatiana Vieira', email: 'tatiana@aptus.com', CREF: '990011-G/AM', UF: 'AM', town: 'Manaus', specialties: ['Natação', 'Aquático', 'Hidroginástica'], rating: 4.7, experience: 5, availability: { workDays: [3,4,5,6], startHour: 8, endHour: 18 } },
    { _id: '13', name: 'Eduardo Porto', email: 'eduardo@aptus.com', CREF: '223344-G/PA', UF: 'PA', town: 'Belém', specialties: ['Funcional', 'Treino ao Ar Livre', 'Resistência'], rating: 4.5, experience: 4, availability: { workDays: [1,2,4,5], startHour: 7, endHour: 17 } },
    { _id: '14', name: 'Mariana Luz', email: 'mariana@aptus.com', CREF: '556677-G/RN', UF: 'RN', town: 'Natal', specialties: ['Pilates', 'Postura', 'Reabilitação'], rating: 4.8, experience: 9, availability: { workDays: [2,3,5,6], startHour: 9, endHour: 19 } },
    { _id: '15', name: 'Felipe Castro', email: 'felipe@aptus.com', CREF: '889900-G/MS', UF: 'MS', town: 'Campo Grande', specialties: ['Crossfit', 'HIIT', 'Condicionamento'], rating: 4.9, experience: 8, availability: { workDays: [1,3,4,5,6], startHour: 6, endHour: 18 } },
    { _id: '16', name: 'Vanessa Dias', email: 'vanessa@aptus.com', CREF: '112233-G/ES', UF: 'ES', town: 'Vitória', specialties: ['Dança', 'Expressão Corporal', 'Cardio'], rating: 4.7, experience: 7, availability: { workDays: [1,2,4,5], startHour: 8, endHour: 17 } },
    { _id: '17', name: 'Rodrigo Martins', email: 'rodrigo@aptus.com', CREF: '445566-G/PB', UF: 'PB', town: 'João Pessoa', specialties: ['Funcional', 'Mobilidade', 'Força'], rating: 4.6, experience: 6, availability: { workDays: [2,3,5,6], startHour: 7, endHour: 16 } },
    { _id: '18', name: 'Isabela Santos', email: 'isabela@aptus.com', CREF: '778899-G/AL', UF: 'AL', town: 'Maceió', specialties: ['Yoga', 'Meditação', 'Relaxamento'], rating: 4.8, experience: 5, availability: { workDays: [1,3,4,6], startHour: 9, endHour: 18 } },
    { _id: '19', name: 'Leonardo Pereira', email: 'leonardo@aptus.com', CREF: '990011-G/SE', UF: 'SE', town: 'Aracaju', specialties: ['Musculação', 'Hipertrofia', 'Força'], rating: 4.7, experience: 7, availability: { workDays: [1,2,3,4,5], startHour: 10, endHour: 20 } },
    { _id: '20', name: 'Beatriz Ramos', email: 'beatriz@aptus.com', CREF: '223344-G/TO', UF: 'TO', town: 'Palmas', specialties: ['Pilates', 'Alongamento', 'Postura'], rating: 4.9, experience: 10, availability: { workDays: [2,3,4,5,6], startHour: 7, endHour: 19 } }
  ];

  const filteredProfessionals = professionals.filter(professional =>
    professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professional.town.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professional.CREF.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="professionals-container">
      <div className="professionals-header">
        <h1>Profissionais Disponíveis</h1>
        <p>Encontre o personal trainer ideal para seus objetivos</p>
        
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar por nome, cidade ou CREF"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      <div className="professionals-grid">
        {filteredProfessionals.map((professional) => (
          <div key={professional._id} className="professional-card">
            <div className="professional-image">
              <div className="image-circle">
                {professional.name.charAt(0)}
              </div>
            </div>
            <div className="professional-info">
              <h3>{professional.name}</h3>
              <div className="rating">
                {'★'.repeat(Math.floor(professional.rating))}
                {'☆'.repeat(5 - Math.floor(professional.rating))}
                <span>({professional.rating})</span>
              </div>
              <div className="professional-meta">
                <span>CREF: {professional.CREF}</span>
                <span>{professional.experience} anos exp.</span>
              </div>
              <p className="location">{professional.town}, {professional.UF}</p>
              <div className="specialties">
                {professional.specialties.map(spec => (
                  <span key={spec} className="specialty-tag">{spec}</span>
                ))}
              </div>
              <p className="availability">
                <strong>Horário:</strong> {professional.availability.startHour}h - {professional.availability.endHour}h
              </p>
            </div>
            <button className="details-button">
              Ver mais Detalhes
              <span>→</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfessionalsList;