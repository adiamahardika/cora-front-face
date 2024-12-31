import { motion } from 'framer-motion';
import classes from '@/components/drawer-settings/drawer.module.css'

export const imageVariants = {
    hidden: { opacity: 0, y: 20 }, // Mulai dari opacity 0 dan turun sedikit
    visible: (index: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: index * 0.3, // Delay tiap gambar sesuai urutan
            duration: 0.5,      // Durasi animasi tiap gambar
            ease: 'easeInOut',
        },
    }),
};

export const AnimatedImageList = ({ images }: { images: string[] }) => (
    <div>
        {images.map((image, index) => (
            <motion.div
                key={index}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={imageVariants}
                className="mb-4"
            >
                <img src={image} alt={`Image ${index + 1}`} className={classes.img} />
            </motion.div>
        ))}
    </div>
);