

export interface NFAArrow {
    startNode: number;
    endNode: number;
    action: string;
}

// 用數字來命名 state，
// 這樣的資料結構隱藏表示了以下的屬性
// starting state = 0
// terminal state = nodeCount - 1
// state 的集合 = [0 .. nodeCount]
export interface NFAGraph {
    graph: NFAArrow[];
    nodeCount: number;
}


export interface DFAArrow {
    startNode: number[];
    endNode: number[];
    action: string;
}

export interface DFAGraph {
    setOfState: number[][];
    graph: DFAArrow[];
    startingState: number[];
    terminalState: number[][];
}