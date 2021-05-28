import "./login.css";
export default function Login({loginWithRedirect}) {

    return (

        <div className="login-container">
            <div className="login-form">
                <form>
                    <input
                        type="submit"
                        className="profile-submit-btn"
                        value="Signin" onClick={loginWithRedirect}
                    />
                </form>
            </div>
        </div>
    );
}
