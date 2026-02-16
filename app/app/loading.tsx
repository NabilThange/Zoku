import React from 'react';
import styled from 'styled-components';

const Loader: React.FC = () => {
  return (
    <StyledWrapper>
      <div className="loader-container">
        {/* Main cooking pot */}
        <div className="cooking-pot">
          <div className="pot-body">
            <div className="pot-handle left-handle"></div>
            <div className="pot-handle right-handle"></div>
            <div className="pot-lid">
              <div className="lid-knob"></div>
            </div>
            <div className="bubbles">
              <div className="bubble bubble1"></div>
              <div className="bubble bubble2"></div>
              <div className="bubble bubble3"></div>
              <div className="bubble bubble4"></div>
            </div>
          </div>
        </div>

        {/* Steam animation */}
        <div className="steam">
          <div className="steam-line steam1"></div>
          <div className="steam-line steam2"></div>
          <div className="steam-line steam3"></div>
          <div className="steam-line steam4"></div>
        </div>

        {/* Floating ingredients */}
        <div className="ingredients">
          <div className="ingredient carrot">🥕</div>
          <div className="ingredient tomato">🍅</div>
          <div className="ingredient onion">🧅</div>
          <div className="ingredient pepper">🌶️</div>
        </div>

        {/* Loading text */}
        <div className="loading-text">
          <p>Cooking</p>
          <div className="words">
            <span className="word">delicious meals</span>
            <span className="word">fresh recipes</span>
            <span className="word">tasty dishes</span>
            <span className="word">amazing flavors</span>
            <span className="word">delicious meals</span>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .loader-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    position: relative;
    background: #F8F8F8;
    padding: 2rem;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(255, 165, 0, 0.1);
  }

  /* Cooking Pot */
  .cooking-pot {
    position: relative;
    margin-bottom: 2rem;
  }

  .pot-body {
    width: 100px;
    height: 80px;
    background: linear-gradient(145deg, #FFA500, #FF8C00);
    border-radius: 0 0 40px 40px;
    position: relative;
    box-shadow: 
      inset 0 -10px 20px rgba(0, 0, 0, 0.1),
      0 5px 15px rgba(255, 165, 0, 0.3);
    animation: pot-wobble 2s ease-in-out infinite;
  }

  .pot-handle {
    width: 20px;
    height: 15px;
    border: 4px solid #FF8C00;
    border-radius: 50%;
    position: absolute;
    top: 20px;
    background: transparent;
  }

  .left-handle {
    left: -20px;
    border-right: none;
  }

  .right-handle {
    right: -20px;
    border-left: none;
  }

  .pot-lid {
    width: 110px;
    height: 20px;
    background: linear-gradient(145deg, #FFA500, #FF8C00);
    border-radius: 50px;
    position: absolute;
    top: -10px;
    left: -5px;
    box-shadow: 
      0 -3px 10px rgba(0, 0, 0, 0.1),
      inset 0 3px 8px rgba(255, 255, 255, 0.2);
    animation: lid-bounce 2s ease-in-out infinite;
  }

  .lid-knob {
    width: 12px;
    height: 8px;
    background: #FF8C00;
    border-radius: 50%;
    position: absolute;
    top: -4px;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }

  /* Bubbles inside pot */
  .bubbles {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 0 0 40px 40px;
  }

  .bubble {
    position: absolute;
    background: rgba(248, 248, 248, 0.7);
    border-radius: 50%;
    animation: bubble-rise 1.5s ease-in-out infinite;
  }

  .bubble1 {
    width: 8px;
    height: 8px;
    left: 20%;
    animation-delay: 0s;
  }

  .bubble2 {
    width: 12px;
    height: 12px;
    left: 40%;
    animation-delay: 0.3s;
  }

  .bubble3 {
    width: 6px;
    height: 6px;
    left: 60%;
    animation-delay: 0.6s;
  }

  .bubble4 {
    width: 10px;
    height: 10px;
    left: 80%;
    animation-delay: 0.9s;
  }

  /* Steam Animation */
  .steam {
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
  }

  .steam-line {
    width: 3px;
    height: 40px;
    background: rgba(248, 248, 248, 0.6);
    border-radius: 50px;
    position: absolute;
    animation: steam-rise 2s ease-in-out infinite;
  }

  .steam1 {
    left: -10px;
    animation-delay: 0s;
  }

  .steam2 {
    left: -3px;
    animation-delay: 0.5s;
  }

  .steam3 {
    left: 4px;
    animation-delay: 1s;
  }

  .steam4 {
    left: 11px;
    animation-delay: 1.5s;
  }

  /* Floating Ingredients */
  .ingredients {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .ingredient {
    position: absolute;
    font-size: 24px;
    animation: float 3s ease-in-out infinite;
  }

  .carrot {
    top: 20%;
    left: 10%;
    animation-delay: 0s;
  }

  .tomato {
    top: 30%;
    right: 10%;
    animation-delay: 0.8s;
  }

  .onion {
    bottom: 40%;
    left: 5%;
    animation-delay: 1.5s;
  }

  .pepper {
    bottom: 35%;
    right: 5%;
    animation-delay: 2.3s;
  }

  /* Loading Text */
  .loading-text {
    color: #FF8C00;
    font-family: 'Arial', sans-serif;
    font-weight: 600;
    font-size: 20px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .words {
    height: 30px;
    overflow: hidden;
    position: relative;
  }

  .words::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      transparent 20%,
      #F8F8F8 50%,
      transparent 80%
    );
    z-index: 2;
  }

  .word {
    display: block;
    height: 100%;
    font-size: 16px;
    color: #FFA500;
    animation: word-cycle 5s infinite;
    padding: 0.2rem 0;
  }

  /* Animations */
  @keyframes pot-wobble {
    0%, 100% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(1deg);
    }
    75% {
      transform: rotate(-1deg);
    }
  }

  @keyframes lid-bounce {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-3px);
    }
  }

  @keyframes bubble-rise {
    0% {
      bottom: 0;
      opacity: 1;
    }
    100% {
      bottom: 100%;
      opacity: 0;
    }
  }

  @keyframes steam-rise {
    0% {
      transform: translateY(0px) scaleX(1);
      opacity: 0.8;
    }
    100% {
      transform: translateY(-30px) scaleX(1.5);
      opacity: 0;
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
    }
    33% {
      transform: translateY(-10px) rotate(5deg);
    }
    66% {
      transform: translateY(5px) rotate(-3deg);
    }
  }

  @keyframes word-cycle {
    0% {
      transform: translateY(0%);
    }
    20% {
      transform: translateY(-100%);
    }
    25% {
      transform: translateY(-100%);
    }
    45% {
      transform: translateY(-200%);
    }
    50% {
      transform: translateY(-200%);
    }
    70% {
      transform: translateY(-300%);
    }
    75% {
      transform: translateY(-300%);
    }
    95% {
      transform: translateY(-400%);
    }
    100% {
      transform: translateY(-400%);
    }
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .loader-container {
      padding: 1rem;
      min-height: 250px;
    }

    .pot-body {
      width: 80px;
      height: 65px;
    }

    .pot-lid {
      width: 90px;
    }

    .ingredient {
      font-size: 20px;
    }

    .loading-text {
      font-size: 18px;
    }

    .word {
      font-size: 14px;
    }
  }
`;

export default Loader;
