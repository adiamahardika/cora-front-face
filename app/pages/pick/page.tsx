import classes from './pick.module.css'

export default function PickPage() {
    return (
        <div className={classes.body}>
            <div className={classes.item}>
                <img src="/male-profile.svg" alt="Male Profile"/>
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-3xl">
                    Male
                </h1>
            </div>
            <div className={classes.item}>
                <img src="/female-profile.svg" alt="Male Profile"/>
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-3xl">
                    Female
                </h1>
            </div>
        </div>
    )
}