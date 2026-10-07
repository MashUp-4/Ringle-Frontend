import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import TutorPage from './pages/TutorPage'
import './App.css'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/tutors" element={<TutorPage />} />
      <Route path="/tutors/:tutorId" element={<TutorPage />} />
      <Route
        path="*"
        element={
          <main className="p-10">
            <h1>페이지를 찾을 수 없어요</h1>
            <a href="/tutors">튜터 목록으로 돌아가기</a>
          </main>
        }
      />
    </Routes>
  )
}
