import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import styles from '../styles/formulario.module.css';

const UsuariosCadastroPage: React.FC = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [cargo, setCargo] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  const cargos = [
    { value: { id: 1, nome_cargo: "Administrador" }, label: 'Administrador' },
    { value: { id: 2, nome_cargo: "Funcionário" }, label: 'Funcionário' },
  ];
 
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!nome || !cpf || !cargo || !email || !senha) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    try {
      // Enviar os dados do novo usuário para o backend
      const response = await fetch('http://localhost:8080/usuario/cadastrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome,
          cpf,
          cargo,
          email,
          senha
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao cadastrar usuário');
      }

      // Limpar os campos do formulário após o cadastro
      setNome('');
      setCpf('');
      setCargo('');
      setEmail('');
      setSenha('');
      setError('');

      // Mostrar uma mensagem de sucesso
      Swal.fire({
        title: 'Usuário cadastrado!',
        text: 'O usuário foi cadastrado com sucesso!',
        icon: 'success',
        confirmButtonText: 'OK'
      });

    } catch (error) {
      // Em caso de erro, mostrar uma mensagem de erro
      console.error('Erro ao cadastrar usuário:', error);
      Swal.fire({
        title: 'Erro!',
        text: 'Ocorreu um erro ao cadastrar o usuário. Por favor, tente novamente mais tarde.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <div className={styles['form-container']}>
      <h1>Cadastro de Usuário</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          Nome:
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
        </label>
        <br />
        <label>
          CPF:
          <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} />
        </label>
        <br />
        <label>
          Cargo:
          <select value={cargo} onChange={(e) => setCargo(e.target.value)}>
            <option value="">Selecione o cargo</option>
            {cargos.map((cargo, index) => (
              <option key={index} value={cargo.value.id}>{cargo.label}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <br />
        <label>
          Senha:
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
        </label>
        <br />
        <button type="submit" className={styles['submit-button']}>Cadastrar Usuário</button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

export default UsuariosCadastroPage;
