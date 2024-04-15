import { Component } from "react"
import logo from "../images/logo-youtan.png"
import styles from '../styles/login.module.css'

export default class LoginPage extends Component{
    render(){
        return(
            <>
            <div className={styles.login}>
                <div>
                    <img className={styles.logo} src={logo} alt="logo-youtan" />
                </div>
                <div>
                    <input className={styles.username} placeholder="Username" />
                    <input className={styles.password} type="password" placeholder="Password" />
                    <button className={styles.btn_login}>Entrar</button>
                </div>
            </div>
            </>
        )
    }
}