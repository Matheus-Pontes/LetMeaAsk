import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type Questions = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }

    content: string;
    isAnswered: boolean;
    isHighLighted: boolean;
    likeCount: number;
    likeId: string | undefined;
}

type firebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }

    content: string;
    isAnswered: boolean;
    isHighLighted: boolean;
    likes: Record<string, {authorId: string;}>
}>


export function useRoom(roomId: string) {
    const { user } = useAuth();
    const [questions, setQuestions] = useState<Questions[]>([]);
    const [title, setTitle] = useState('');

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);
    
        /* Quando houver uma alteração nos dados abaixo,vai ocorrer uma atualização na página e nos dados
        - para poucas perguntas, isso funciona 
        - porem, muitas temos que tratar de outra forma
        */    
        roomRef.on('value', room => {

            const databaseRoom = room.val();
            const firebaseQuestion: firebaseQuestions = databaseRoom.questions ?? {};
              

            const parsedQuestions = Object.entries(firebaseQuestion).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighLighted: value.isHighLighted,
                    isAnswered: value.isAnswered,
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
                }
            });

            setTitle(databaseRoom.title);
            setQuestions(parsedQuestions);

            return () => {
                roomRef.off('value');
            }
        })
    }, [ roomId, user?.id ]); 

    return { questions, title}
}

