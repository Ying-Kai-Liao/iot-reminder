'use client';
import { useRouter } from "next/navigation";
import axios from "axios";

const TestClient = (data: any) => {
    let reply = 'something';
    const router = useRouter();

    const register = () => {
        console.log(data);
        axios.post('/api/user/register', data.data)
            .then(res => reply = res.data)
            .catch(err => reply = err.data)
            .finally(() => {
                console.log(reply);
                router.refresh();
            });


        if (reply == undefined) {
            reply = 'undefined';
        }
    }

    return (
        <div className="bg-neutral-200">
            <button onClick={register}>Register test</button>
            <div>{reply}</div>
        </div>
    )
}

export default TestClient;