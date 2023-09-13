import { useEffect, useState } from "react";

import { initializeApp } from "firebase/app";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import styles from "./homePage.module.css";
import Wanted from "./assets/wanted.png";
import Wanted2 from "./assets/wanted2.jpg";
import Luffy from "./assets/luffy.gif";
import Luffynho from "./assets/luffyinho.gif";
import Emoji from "./assets/emoji.jpeg";
import { getAuth, signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { Modal } from "./components/modal";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyDhr0s5JjZiQ33euMe1joZVAV0oZLxiU54",
  authDomain: "onepieceinvite.firebaseapp.com",
  projectId: "onepieceinvite",
  storageBucket: "onepieceinvite.appspot.com",
  messagingSenderId: "840425543521",
  appId: "1:840425543521:web:dbb8d98ec653223aee1720",
  measurementId: "G-MGELLHY45Y",
});

function App() {
  const db = getFirestore(firebaseApp);
  const [user, setUser] = useState<any>(null);
  const [yesModal, setYesModal] = useState(false);
  const [noModal, setNoModal] = useState(false);
  const [status, setStatus] = useState("");
  const [loginModal, setLoginModal] = useState(false);

  const get = async (collectionName: any, data: any) => {
    try {
      const docRef = doc(db, collectionName, data);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      }

      return false;
    } catch (e) {
      console.log("error get()", e);
      return false;
    }
  };

  const getAll = async (collectionName: any) => {
    try {
      const data: any[] = [];

      const docRef = collection(db, collectionName);
      const docSnap = await getDocs(docRef);

      docSnap.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });

      return data;
    } catch (e) {
      console.log("error get()", e);
      return false;
    }
  };

  const createUser = async (collectionName: any, data: any) => {
    try {
      await setDoc(doc(db, collectionName, data.id), data);

      return true;
    } catch (e) {
      console.log("error createUser()", e);
      return false;
    }
  };

  const update = async (collectionName: any, data: any) => {
    try {
      const collection = doc(db, collectionName, data.id);
      await updateDoc(collection, data);

      return true;
    } catch (e) {
      console.log("error update()", e);
      return false;
    }
  };

  const auth = getAuth(firebaseApp);
  const provider = new GoogleAuthProvider();

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Aqui você pode salvar as informações do usuário no Firestore ou em qualquer outro lugar.
      const existingUser = (await get("users", user.uid)) as any;

      const userData = {
        id: user.uid,
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      };

      // Verifica se o usuário já existe no banco de dados antes de criar um novo.
      if (!existingUser) {
        await createUser("users", userData);
        setUser(userData);
        return;
      }

      setUser(existingUser);
    } catch (error) {
      console.error("Erro ao autenticar com o Google:", error);
    }
  };

  const handleSubmit = async () => {
    const data = {
      id: user?.id,
      status: "yes",
    };
    await update("users", data);
    setStatus("yes");
  };

  const hanldeOpenYesModal = () => {
    if (!user) return;
    setYesModal(true);
  };

  console.log(user);

  useEffect(() => {
    if (!user) {
      setLoginModal(true);
    }
    if (user) {
      setLoginModal(false);
    }
  }, [user]);

  console.log(user, "eu");

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.wantedContainer}>
          <img
            src={Wanted2}
            alt=""
            style={{ zIndex: 1, width: "100%", height: "100%" }}
          />

          <div className={styles.imageContainer}>
            <img className={styles.photo} src={user?.photo} alt="" />
          </div>

          {/* <div className={styles.contentContainer}> */}
          <p className={styles.nameText}>{user?.name}</p>
          <p className={styles.presentText}>Posso confirmar sua presença?</p>

          <div className={styles.buttonContainer}>
            <button className={styles.yesButton} onClick={hanldeOpenYesModal}>
              SIM
            </button>
            <button
              className={styles.noButton}
              onClick={() => setNoModal(true)}
            >
              NÃO
            </button>
          </div>
        </div>
      </div>
      {/* </div> */}
      <Modal isOpen={yesModal} closeModal={() => setYesModal(false)}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
          }}
        >
          <p style={{ fontSize: "20px", marginTop: "10px", marginBottom: "0" }}>
            Contarei com sua presença!
          </p>
          {status === "yes" ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "28px",
                margin: "16px 0px",
              }}
            >
              <strong style={{ fontSize: "20px" }}>Localização</strong>
              <p style={{ textAlign: "center" }}>
                R. Prof. Joaquim Santiago, 256 - Expedicionários, João Pessoa -
                PB, 58041-030
              </p>
              <strong>Residencial guadarrama</strong>
            </div>
          ) : (
            <div style={{ width: "340px", height: "270px" }}>
              <img
                style={{ width: "100%", height: "100%" }}
                src={Luffy}
                alt=""
              />
            </div>
          )}

          {status === "yes" ? (
            <button
              className={styles.goButton}
              onClick={() => setYesModal(false)}
            >
              OK !
            </button>
          ) : (
            <button className={styles.goButton} onClick={handleSubmit}>
              Estarei lá!
            </button>
          )}
        </div>
      </Modal>
      <Modal isOpen={noModal} closeModal={() => setNoModal(false)}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
          }}
        >
          <p style={{ fontSize: "20px", marginTop: "10px", marginBottom: "0" }}>
            Vai perder!
          </p>

          <div style={{ width: "340px", height: "270px" }}>
            <img
              style={{ width: "100%", height: "100%" }}
              src={Luffynho}
              alt=""
            />
          </div>

          <button className={styles.goButton} onClick={() => setNoModal(false)}>
            Tchauzinho
          </button>
        </div>
      </Modal>

      <Modal isOpen={loginModal} closeModal={() => setLoginModal(false)}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
          }}
        >
          <p
            style={{
              fontSize: "18px",
              marginTop: "10px",
              marginBottom: "0",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Faça Login para Confirmar sua presença no meu aniversário!
          </p>

          <div style={{ width: "340px", height: "240px" }}>
            <img style={{ width: "100%", height: "100%" }} src={Emoji} alt="" />
          </div>

          <button className={styles.goButton} onClick={signInWithGoogle}>
            Fazer Login com Google
          </button>
        </div>
      </Modal>
    </>
  );
}

export default App;
