import React, { useState } from 'react';
import Swal from 'sweetalert2';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import styles from '../styles/formularioUsuario.module.css';

const UsuariosCadastroPage: React.FC = () => {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [cargo, setCargo] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  const cargos = [
    { value: { id: 1, nome_cargo: "Administrador" }, label: 'Administrador' },
    { value: { id: 2, nome_cargo: "Funcionário" }, label: 'Funcionário' },
  ];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!nome || !cpf || !cargo || !senha) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/usuario/cadastrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome,
          cpf,
          email,
          cargo,
          senha
        })
      });

      if (response.status === 401) {
        setError('CPF já está em uso');
        return;
      }

      if (!response.ok) {
        throw new Error('Erro ao cadastrar usuário');
      }

      setNome('');
      setCpf('');
      setEmail('');
      setCargo('');
      setSenha('');
      setError('');

      Swal.fire({
        title: 'Usuário cadastrado!',
        text: 'O usuário foi cadastrado com sucesso!',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        window.location.href = '/usuarios';
      });

      

    } catch (error: any) {
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
    <div>
      <Navbar local="usuarios" />
      <div className={styles['form-container']}>
        <h1>Cadastro de Usuário</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>
            <span className='input_required'>Nome:</span>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
          </label>
          <br />
          <label>
            <span className="input_required">CPF:</span>
            <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} />
          </label>
          <br />
          <label>
            <span className="input_required">Email:</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <br />
          <label>
            <span className='input_required'>Cargo:</span>
            <select value={cargo} onChange={(e) => setCargo(e.target.value)}>
              <option value="">Selecione o cargo</option>
              {cargos.map((cargo, index) => (
                <option key={index} value={cargo.value.id}>{cargo.label}</option>
              ))}
            </select>
          </label>
          <br />
          <label>
            <span className='input_required'>Senha:</span>
            <input className={styles.senha} type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
          </label>
          <br />
          <button type="submit" className={styles['submit-button']}>Cadastrar Usuário</button>
          {error && <p className={styles.error}>{error}</p>}
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default UsuariosCadastroPage;
