'use client'

import { useState, useEffect } from 'react'
import { Slider } from "@/components/ui/slider"
import { useQuery } from '@tanstack/react-query';
import { Role, RoleWithScores } from '@/app/utils/types';
import { Input } from '../input';
import { getDate } from '@/app/utils/dateFormat';
import { getRolesWithScores } from '@/app/actions/getRolesWithScores';
import { Button } from '../button';
import { insertEvaluation, insertScore, updateEvaluations } from '@/app/actions/insertEvaluations';
import { getRoles } from '@/app/actions/getRoles';
import { useRouter } from 'next/navigation';

type Score = {
  current: number;
  desired: number;
}

const hasScores = (role: Role | RoleWithScores): role is RoleWithScores => !!(role as RoleWithScores).roleScores

export default function SegmentedCircle({ evaluationId }: { evaluationId: string }) {
  const router = useRouter()
  const [endDate, setEndDate] = useState<string>()
  const [startDate, setStartDate] = useState<string>()
  const { data: roles } = useQuery<RoleWithScores[] | Role[]>({
    queryKey: [`rolesWithScores/${evaluationId}`], queryFn: () => {
      if (evaluationId === "new") {
        return getRoles()
      } else {
        return getRolesWithScores(evaluationId)
      }
    }
  })
  const [scores, setScores] = useState<Score[]>([
    { current: 0, desired: 0 }
  ])

  useEffect(() => {
    if (roles) {
      const someRole = roles[0]
      if (hasScores(someRole)) {
        setStartDate(getDate(someRole.roleScores.evaluation.startTimestamp))
        setEndDate(getDate(someRole.roleScores.evaluation.endTimestamp))
        setScores(roles.map((role, index) => {
          return ({ current: (role as RoleWithScores).roleScores.currentScore, desired: (role as RoleWithScores).roleScores.desiredScore })
        }))
      } else {
        setScores(roles.map((role, index) => {
          return ({ current: 0, desired: 0 })
        }))
      }
    }
  }, [roles])

  const createSegments = () => {
    if (roles) {
      const segmentAngle = 360 / roles.length
      return roles.map((role, index) => {
        const startAngle = index * segmentAngle
        const endAngle = (index + 1) * segmentAngle
        return (
          <g key={index}>
            <path
              d={describeArc(175, 175, 150, startAngle, endAngle)}
              fill={`rgba(0, 0, 0, 0.4)`}
              stroke="white"
              strokeWidth="2"
            />
            {scores[index] && createScoredDividers(index, startAngle, scores[index], role)}
          </g>
        )
      })
    }
  }

  const createScoredDividers = (index: number, angle: number, score: Score, role: Role) => {
    const start = polarToCartesian(175, 175, 20, angle)
    const currentEnd = polarToCartesian(175, 175, 20 + (score.current * 16.25), angle)
    const desiredEnd = polarToCartesian(175, 175, 20 + (score.desired * 16.25), angle)
    const labelPosition = polarToCartesian(175, 175, 20 + (8 * 16.25) + 15, angle)
    // const pointPositionCurrent = polarToCartesian(175, 175, 20 + (score.current * 16.25) + 15, angle)
    // const pointPositionDesired = polarToCartesian(175, 175, 20 + (score.desired * 16.25) + 15, angle)
    return (
      <>
        <line
          x1={start.x}
          y1={start.y}
          x2={currentEnd.x}
          y2={currentEnd.y}
          stroke="red"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1={start.x}
          y1={start.y}
          x2={desiredEnd.x}
          y2={desiredEnd.y}
          stroke="blue"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <text
          x={labelPosition.x}
          y={labelPosition.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="black"
          fontSize="10"
          fontWeight="bold"
        >
          {`${role.title}`}
        </text>
        {/* Hiding score for now */}
        {/* <text
          x={pointPositionCurrent.x}
          y={pointPositionCurrent.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="black"
          fontSize="10"
          id='current'
          fontWeight="bold"
        >
          {`${score.current}`}
        </text>
        <text
          x={pointPositionDesired.x}
          y={pointPositionDesired.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="black"
          fontSize="10"
          id="desired"
          fontWeight="bold"
        >
          {`${score.desired}`}
        </text> */}
      </>
    )
  }

  const createScorePolygon = (scoreType: 'current' | 'desired') => {
    const points = scores.map((score, index) => {
      const angle = (index / (roles?.length || 2)) * 360
      const value = scoreType === 'current' ? score.current : score.desired
      return polarToCartesian(175, 175, 20 + (value * 16.25), angle)
    })
    return (
      <polygon
        points={points.map(p => `${p.x},${p.y}`).join(' ')}
        fill={scoreType === 'current' ? 'rgba(0, 0, 0, .8)' : 'rgba(255, 255, 0, 0.8)'}
        stroke={scoreType === 'current' ? 'white' : 'yellow'}
        strokeWidth="2"
      />
    )
  }

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    }
  }

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle)
    const end = polarToCartesian(x, y, radius, startAngle)
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"
    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "L", x, y,
      "Z"
    ].join(" ")
  }

  const handleScoreChange = (index: number, type: 'current' | 'desired', newScore: number[]) => {
    setScores(prevScores => {
      const updatedScores = [...prevScores]
      updatedScores[index] = { ...updatedScores[index], [type]: newScore[0] }
      return updatedScores
    })
  }

  const saveEvaluation = async () => {


    if (evaluationId === "new" && roles && endDate && startDate) {
      const newEvaluationId = await insertEvaluation({
        endTimestamp: new Date(endDate),
        startTimestamp: new Date(startDate),
      })
      insertScore(roles.map((role, index) => ({
        currentScore: scores[index].current,
        desiredScore: scores[index].desired,
        roleId: role.id,
        evaluationId: newEvaluationId,

      })))
      router.push(`/evaluations/${newEvaluationId}`)
    }
    else if (roles && startDate && endDate) {
      updateEvaluations(roles.map((role, index) => ({
        ...(role as RoleWithScores).roleScores,
        currentScore: scores[index].current,
        desiredScore: scores[index].desired,
        endTimestamp: new Date(endDate),
        startTimestamp: new Date(startDate)
      })))
    }
  }

  return (
    <div className="flex flex-col items-center space-y-6 p-6 bg-white rounded-lg shadow-md">

      <h2 className="text-2xl font-bold text-gray-800">Segmented Circle with Connected Scores</h2>
      <div className='flex flex-row gap-4'>
        <Input.TimeDate
          label="Start"
          type='date'
          value={startDate}
          setValue={(event) => setStartDate(event)}
        />
        <Input.TimeDate
          label="End"
          type='date'
          value={endDate}
          setValue={(event) => setEndDate(event)}
        />
      </div>
      <svg width="400" height="350" viewBox="0 0 350 350">
        <circle cx="175" cy="175" r="150" fill="none" stroke="#e5e7eb" strokeWidth="1" />
        {createSegments()}
        {createScorePolygon('desired')}
        {createScorePolygon('current')}
      </svg>
      <div className="w-full max-w-xs my-4 flex flex-row gap-4">
        <div className='flex flex-col gap-2'>
          <div className='flex gap-4'>
            <h3 className="text-lg font-semibold text-gray-800">Current scores</h3>
            <h3 className="text-lg font-semibold text-gray-800">Desired scores</h3>
          </div>

          {roles?.map((role, index) => (
            <div key={index} className="flex flex-row gap-4">
              <h4 className='w-36'>{role.title}</h4>
              <div className="w-full">
                <label className="text-sm font-medium text-gray-700 mb-2">
                  {scores[index]?.current}
                </label>
                <Slider
                  min={1}
                  max={8}
                  step={1}
                  value={[scores[index]?.current]}
                  onValueChange={(value) => handleScoreChange(index, 'current', value)}
                />

              </div>
              <div className="w-full">
                <label className="text-sm font-medium text-gray-700 mb-2">
                  {scores[index]?.desired}
                </label>
                <Slider
                  min={1}
                  max={8}
                  step={1}
                  value={[scores[index]?.desired]}
                  onValueChange={(value) => handleScoreChange(index, 'desired', value)}
                />
              </div>
            </div>
          ))}
          <Button.Primary onClick={saveEvaluation} title='Save evaluation' />
        </div>
      </div>
    </div>
  )
}