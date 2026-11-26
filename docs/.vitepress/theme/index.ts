import DefaultTheme from 'vitepress/theme'
import './custom.css'

// 交互式可视化组件
import VisPlayer from './components/VisPlayer.vue'
import VisSorting from './components/VisSorting.vue'
import VisBinarySearch from './components/VisBinarySearch.vue'
import VisLinkedList from './components/VisLinkedList.vue'
import VisStackQueue from './components/VisStackQueue.vue'
import VisHashTable from './components/VisHashTable.vue'
import VisTree from './components/VisTree.vue'
import VisHeap from './components/VisHeap.vue'
import VisGraph from './components/VisGraph.vue'
import VisSlidingWindow from './components/VisSlidingWindow.vue'
import VisDynamicProgramming from './components/VisDynamicProgramming.vue'
import VisBacktracking from './components/VisBacktracking.vue'
import VisComplexity from './components/VisComplexity.vue'
import VisGreedy from './components/VisGreedy.vue'
import VisRecursion from './components/VisRecursion.vue'
import AiAssistant from './components/AiAssistant.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('VisPlayer', VisPlayer)
    app.component('VisSorting', VisSorting)
    app.component('VisBinarySearch', VisBinarySearch)
    app.component('VisLinkedList', VisLinkedList)
    app.component('VisStackQueue', VisStackQueue)
    app.component('VisHashTable', VisHashTable)
    app.component('VisTree', VisTree)
    app.component('VisHeap', VisHeap)
    app.component('VisGraph', VisGraph)
    app.component('VisSlidingWindow', VisSlidingWindow)
    app.component('VisDynamicProgramming', VisDynamicProgramming)
    app.component('VisBacktracking', VisBacktracking)
    app.component('VisComplexity', VisComplexity)
    app.component('VisGreedy', VisGreedy)
    app.component('VisRecursion', VisRecursion)
    app.component('AiAssistant', AiAssistant)
  },
}
