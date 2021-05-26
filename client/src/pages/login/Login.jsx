import "./login.css";
export default function Login({loginWithRedirect}) {

    return (

        <div className="login-container">
            <div className="logo">
                {/*<img src="https://logos-world.net/wp-content/uploads/2020/05/WhatsApp-Logo.png"/>*/}
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
