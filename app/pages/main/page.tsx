'use client';
import classes from './main.module.css';
import AvatarContext from "@/components/avatar/avatar-context";
import { useContext, useState, useEffect } from "react";
import IconSettings from "@/components/icon/icon";
import BubbleComponent from "@/components/bubble-container/bubble";
import WebSocketGreeting from '@/components/welcome/welcome';

export default function PickPage() {
  const { avatar } = useContext(AvatarContext);
  const [greeting, setGreeting] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Mengatur bubble saat ada teks greeting baru
  useEffect(() => {
    if (greeting) {
      setIsSpeaking(true); // Menampilkan bubble
      const timer = setTimeout(() => setIsSpeaking(false), 3000); // Sembunyikan setelah 3 detik
      return () => clearTimeout(timer); // Bersihkan timer jika ada update
    }
  }, [greeting]);

  return (
    <div className={classes.body}>
      <div className={classes.wrapper}>
        <div className={classes.wrapperIcon}>
          <IconSettings />
        </div>
        <div className={classes.wrapperImg}>
          {/* Bubble hanya terlihat saat isSpeaking true */}
          <BubbleComponent content={greeting} isVisible={isSpeaking} />
          <div className={classes.imgContainer}>
            <img
              src="/mouth.gif"
              alt="Mouth Animation"
              className={classes.gif}
            />
            <img
              className={classes.imgProfile}
              src={`/${avatar}.svg`}
              alt="Selected Avatar"
            />
          </div>
        </div>
        <div className={classes.hidden}>
          <IconSettings />
        </div>
        <WebSocketGreeting
          aigender={avatar}
          setGreetingCallback={setGreeting} // Memperbarui greeting dari WebSocket
        />
      </div>
    </div>
  );
}
