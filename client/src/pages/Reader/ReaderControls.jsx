import { useSelector, useDispatch } from 'react-redux'
import {
  setReaderSpeed,
  setReaderVoice,
  toggleAutoNextChapter,
} from '../../redux/settingSlice'

import Dropdown from '../../components/Dropdown'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faAngleLeft,
  faAngleRight,
  faPauseCircle,
  faPlayCircle,
} from '@fortawesome/free-solid-svg-icons'
import style from './styles.module.css'

function ReaderControls({ reading, onStart, onStop, onPrev, onNext, voices }) {
  const dispatch = useDispatch()
  const speed = useSelector((state) => state.setting.reader?.speed) || 1
  const voiceName =
    useSelector((state) => state.setting.reader?.voiceName) || null
  const voice = voices.find((v) => v.name === voiceName) || null
  return (
    <div className={`d-flex align-items-center p-1 rounded ${style.controls}`}>
      {!reading ? (
        <div onClick={() => onStart()} className={style.btn}>
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

      <AutoNextToggle />

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
          onChange={(opt) => dispatch(setReaderSpeed(opt.value))}
        />
      </div>

      {/* Dropdown giọng đọc */}
      <div className={style.btn}>
        <Dropdown
          label=''
          classNameToggle={`bg-transparent`}
          options={voices.map((v) => ({ label: v.name, value: v.name }))}
          value={
            voice
              ? { label: voice.name, value: voice.name }
              : { label: 'Mặc định', value: null }
          }
          onChange={(opt) => dispatch(setReaderVoice(opt.value))}
        />
      </div>
    </div>
  )
}

const AutoNextToggle = () => {
  const dispatch = useDispatch()
  const autoNext = useSelector((state) => state.setting.reader.autoNextChapter) // đọc từ Redux

  const handleToggle = () => {
    dispatch(toggleAutoNextChapter()) // toggle trạng thái
  }

  return (
    <div
      className={`${style.autoNextToggle} ${style.btn}`}
      onClick={handleToggle}>
      <div
        className={`${style.toggleTrack} ${autoNext ? style.on : style.off}`}>
        <div className={style.toggleThumb}>
          <FontAwesomeIcon
            icon={autoNext ? faPlayCircle : faPauseCircle}
            className={style.toggleIcon}
          />
        </div>
      </div>
    </div>
  )
}

export default ReaderControls
