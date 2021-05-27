import "./login.css";
export default function Login({loginWithRedirect}) {

    return (

        <div className="login-container">
            <div className="logo">
            </div>
            <div className="login-form">
                <form>
                    <input
                        type="submit"
                        className="profile-submit-btn"
                        value="Join now" onClick={loginWithRedirect}
                    />
                </form>
            </div>
        </div>
    );
}
