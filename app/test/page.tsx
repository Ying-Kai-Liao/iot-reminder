import TestClient from './TestClient';

const TestPage = async () => {
    const data = {
        email: 'test123@gmail.com',
        name: 'test',
        password: 'password'
    }
    return (
        <div className="flex justify-center items-center h-screen bg-neutral-500">
            <div>Something</div>
            <TestClient data={data} />
        </div>
    )
}

export default TestPage;