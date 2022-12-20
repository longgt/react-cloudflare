import React from 'react';
import { withMemo } from 'react-enhance-memo'
import './App.css';

type ChildProps = {
  getCounter: () => number
}

const ChildComponent = (props: ChildProps) => {
  const { getCounter } = props
  const counter = getCounter()
  const [parentCounter, setParentCounter] = React.useState(counter)
  const ref = React.useRef<number>(-1)
  ref.current++

  const checkParentCounter = () => {
    setParentCounter(getCounter())
  }

  return (<React.Fragment>
      <div>
        <div>Counter: {counter}</div>
        <div>Parent counter: {parentCounter}</div>
        <div>Rendered: {ref.current} times</div>
        <div>
          <button onClick={() => checkParentCounter()}>
            Check parent counter
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}

const MemoChildComponent = withMemo(ChildComponent);

const ParentComponent = () => {
  const [counter, setCounter] = React.useState(0)

  const getCounter = React.useCallback(() => {
    console.log(`Current counter: ${counter}`)
    return counter
  }, [counter])

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setCounter((prevState) => prevState + 1)
    }, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  return (
    <React.Fragment>
      <h1>Parent component increases counter every second</h1>
      <div className={'child'}>
        <div className={'title'}>Child component (Re-renders every second along with parent)</div>
        <ChildComponent getCounter={getCounter} />
      </div>
      <hr />
      <div className={'child'}>
        <div className={'title'}>Memo child component (Re-renders after clicking on [Check parent counter] button only)</div>
        <MemoChildComponent getCounter={getCounter} />
      </div>
    </React.Fragment>
  )
}

function App() {
  return (
    <ParentComponent />
  );
}

export default App;
