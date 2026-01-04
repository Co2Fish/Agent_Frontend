import React from 'react'
import { useNavigate } from 'react-router-dom'
import './HomePage.css'

function HomePage() {
  const navigate = useNavigate()

  const scenes = [
    {
      id: 'project-handover',
      title: '项目交接',
      description: '与AI进行项目交接相关的对话',
      isActive: true
    },
    {
      id: 'scene-2',
      title: '场景2',
      description: '待定场景',
      isActive: false
    },
    {
      id: 'scene-3',
      title: '场景3',
      description: '待定场景',
      isActive: false
    },
    {
      id: 'scene-4',
      title: '场景4',
      description: '待定场景',
      isActive: false
    }
  ]

  const handleSceneSelect = (sceneId) => {
    // 在新标签页中打开场景
    window.open(`/chat/${sceneId}`, '_blank')
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>AI 智能助手</h1>
        <p>请选择您需要的场景</p>
      </header>
      
      <main className="scene-grid">
        {scenes.map((scene) => (
          <div 
            key={scene.id}
            className={`scene-card ${scene.isActive ? 'active' : 'inactive'}`}
            onClick={() => scene.isActive && handleSceneSelect(scene.id)}
          >
            <h2>{scene.title}</h2>
            <p>{scene.description}</p>
            {!scene.isActive && <div className="coming-soon">即将上线</div>}
          </div>
        ))}
      </main>
    </div>
  )
}

export default HomePage