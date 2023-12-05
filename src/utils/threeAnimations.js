

export function chainThreeAnimations(mixer, animations = []){

    return {
        start: () => {

            const iterable = animations.values();

            let action = iterable.next().value?.start();

            const listener = (e) => {

                if(e.action === action){

                    const {done, value} = iterable.next();

                    if(!done){

                        setTimeout(() => {  

                            action = value.start();

                        }, 10);
                    }
                    else {

                        mixer.removeEventListener('finished', listener);
                    }
                }
            }

            mixer.addEventListener('finished', listener);
        }
    }
}