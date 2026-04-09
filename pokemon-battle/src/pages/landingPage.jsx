import BattlePicker from "../../components/battlePicker"

export default function LandingPage({ onBattleStart }) {
    return (
    <div>
      <BattlePicker onBattleStart={onBattleStart} />
    </div>
  )
}