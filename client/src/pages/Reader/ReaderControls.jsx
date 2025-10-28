import Dropdown from '../../components/Dropdown '
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faAngleLeft,
  faAngleRight,
  faPauseCircle,
  faPlayCircle,
} from '@fortawesome/free-solid-svg-icons'
import style from './styles.module.css'

function ReaderControls({
  reading,
  onStart,
  onStop,
  onPrev,
  onNext,
  speed,
  onSpeedChange,
  voice,
  onVoiceChange,
  voices,
}) {
  return (
    <div className={`d-flex align-items-center p-1 rounded ${style.controls}`}>
      {!reading ? (
        <div onClick={onStart} className={style.btn}>
          <FontAwesomeIcon className={style.icon} icon={faPlayCircle} />
        </div>
      ) : (
        <>
          <div onClick={onStop} className={style.btn}>
            <FontAwesomeIcon className={style.icon} icon={faPauseCircle} />
          </div>
          <div onClick={onPrev} className={style.btn}>
            <FontAwesomeIcon className={style.icon} icon={faAngleLeft} />
          </div>
          <div onClick={onNext} className={style.btn}>
            <FontAwesomeIcon className={style.icon} icon={faAngleRight} />
          </div>
        </>
      )}

      {/* Dropdown tốc độ */}
      <div className={style.btn}>
        <Dropdown
          label=''
          classNameToggle={`bg-transparent ${style.icon}`}
          options={[
            { label: '0.5x', value: 0.5 },
            { label: '0.75x', value: 0.75 },
            { label: '1x', value: 1 },
            { label: '1.25x', value: 1.25 },
            { label: '1.5x', value: 1.5 },
            { label: '2x', value: 2 },
          ]}
          value={{ label: speed + 'x', value: speed }}
          onChange={(opt) => onSpeedChange(opt.value)}
        />
      </div>

      {/* Dropdown giọng đọc */}
      <div className={style.btn}>
        <Dropdown
          label=''
          classNameToggle={`bg-transparent`}
          options={voices.map((v) => ({
            label: `${v.name}`,
            value: v,
          }))}
          value={
            voice
              ? { label: `${voice.name}`, value: voice }
              : { label: 'Mặc định', value: null }
          }
          onChange={(opt) => onVoiceChange(opt.value)}
        />
      </div>
    </div>
  )
}

export default ReaderControls
