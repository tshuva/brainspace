import { useMemo, useState } from 'react';
import { ResponsivePieCanvas } from '@nivo/pie';
import { ResponsiveLineCanvas } from '@nivo/line';
import { ResponsiveBarCanvas } from '@nivo/bar';
import { ResponsiveRadar } from '@nivo/radar';
import { ResponsiveHeatMapCanvas } from '@nivo/heatmap';
export type Messages = number[][]


// Pie Chart Component


const Pie = ({ data }: { data: Messages }) => {
  const initialPie = Array.from({ length: 21 }, (_, i) => ({
    id: `${i}`,
    label: `${i}`,
    value: 0,
  }))
  const pie = data.flat().reduce((acc, val) =>
    (acc[val].value++, acc) // comma op https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comma_operator
    , initialPie);

  return (
    <ResponsivePieCanvas
      data={pie}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      colors={{ scheme: 'category10' }}
      borderWidth={1}
      borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
    />
  );
};


// Line Chart Component
const Line = ({ data }: { data: Messages }) => {
  const lineData = data.map((row, index) => ({
    id: `Row ${index + 1}`,
    data: row.map((value, i) => ({
      x: i,
      y: value
    }))
  }));

  return (
    <ResponsiveLineCanvas
      data={lineData}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      axisBottom={{
        legend: 'Column',
        legendOffset: 36,
      }}

      pointSize={10}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      legends={[
        {
          anchor: 'bottom-right',
          direction: 'column',
          translateX: 100,
          itemDirection: 'left-to-right',
          itemWidth: 80,
          itemHeight: 20,
        }
      ]}
    />
  );
};

const LineOverLastMsgs = ({ data }: { data: Messages }) => {
  const CHANNELS_NUMBER = 10;

  const [selectedChannels, setSelectedChannels] = useState(
    new Array(CHANNELS_NUMBER).fill(true)
  );

  const formattedData = useMemo(() => {
    return Array.from({ length: CHANNELS_NUMBER }, (_, channel) => ({
      id: `Channel ${channel}`,
      data: data.map((row, i) => ({
        x: i,
        y: row[channel],
      })),
    }));
  }, [data, CHANNELS_NUMBER]);

  return (
    <div className="w-full h-[600px]">

      <div className="flex flex-wrap gap-x-6 gap-y-2 bg-gray-50 rounded-lg items-center justify-center p-4">
        {formattedData.map((line, i) => (
          <label key={i} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 py-1 rounded transition-colors whitespace-nowrap">
            <input
              type="checkbox"
              checked={selectedChannels[i]}
              onChange={() => {
                const updated = [...selectedChannels];
                updated[i] = !updated[i];
                setSelectedChannels(updated);
              }}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 flex-shrink-0"
            />
            <span className="text-sm text-gray-700 select-none">{line.id}</span>
          </label>
        ))}
      </div>

      <ResponsiveLineCanvas
        data={formattedData.filter((_, i) => selectedChannels[i])}
        margin={{ top: 30, right: 30, bottom: 40, left: 50 }}
        xScale={{ type: 'linear' }}
        yScale={{ type: 'linear', min: 0, max: 'auto', stacked: false }}
        axisBottom={{
          legend: 'messages',
          legendOffset: 36,

        }}

        enablePoints={false}
      />
    </div>
  );
};


const Bar = ({ data }: { data: Messages }) => {
  const barData = Array.from({ length: 10 }, (_, i) => ({
    column: `${i + 1}`,
    value: data.reduce((sum, row) => sum + row[i], 0)
  }));

  return (
    <ResponsiveBarCanvas
      data={barData}
      keys={['value']}
      indexBy="column"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      axisBottom={{
        legend: 'Columns',
        legendOffset: 32
      }}
      axisLeft={{
        legend: 'Sum of Values',
        legendPosition: 'middle',
        legendOffset: -40
      }}
    />
  );
};



const RadarChart = ({ data }: { data: Messages }) => {
  const initialRader = Array.from({ length: 21 }, (_, i) => ({
    number: i.toString(),
    count: 0
  }))
  type RadarDatum = typeof initialRader[number]

  const frequencyMap = data
    .flat()
    .reduce((acc, val) => {
      if (val >= 0 && val <= 20) {
        acc[val].count += 1;
      }
      return acc;
    }, initialRader);

  const radarKeyMap = Object.keys(initialRader[0]).reduce((acc, key) => ({ ...acc, [key as keyof RadarDatum]: key as keyof RadarDatum }), {} as { [P in keyof RadarDatum]: keyof RadarDatum });
  return (
    <ResponsiveRadar
      data={frequencyMap}
      keys={[radarKeyMap.count]}
      indexBy={radarKeyMap.number}
      margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
      borderColor={{ from: 'color' }}
      gridLabelOffset={36}
      dotSize={8}
      dotColor={{ theme: 'background' }}
      dotBorderWidth={2}
      blendMode="multiply"
      animate={false}
    />
  );
};




const Heatmap = ({ data }: { data: Messages }) => {
  const initialHeatmap = Array.from({ length: 21 }, (_, number) => ({
    id: number.toString(),
    data: Array.from({ length: 10 }, (_, colIndex) => ({
      x: colIndex + 1,
      y: 0,
    })),
  }));
  const heatmap = data.reduce((acc, message) => {
    const updated = acc.heatmap.map((heatmapRow, heatmapRowIndex) =>
      message.reduce((msgAcc, currentCol, colIndex) => {
        const prevSum = heatmapRow.data[colIndex].y;
        const sum = currentCol === heatmapRowIndex ? prevSum + 1 : prevSum;

        return {
          heatmapRow: [
            ...msgAcc.heatmapRow,
            { x: colIndex + 1, y: sum },
          ],
          min: Math.min(msgAcc.min, sum),
          max: Math.max(msgAcc.max, sum),
        };
      },
        {
          heatmapRow: [] as { x: number; y: number }[],
          min: Infinity,
          max: -Infinity,
        }
      )
    )
    return {
      heatmap: updated.map((d, i) => ({ id: i.toString(), data: d.heatmapRow })),
      min: Math.min(acc.min, ...updated.map(d => d.min)),
      max: Math.max(acc.max, ...updated.map(d => d.max)),
    };
  },
    { heatmap: initialHeatmap, min: Infinity, max: -Infinity, }
  );

  return (
    <ResponsiveHeatMapCanvas
      data={heatmap.heatmap}
      margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
      valueFormat=">-.2s"
      colors={{
        type: 'diverging',
        scheme: 'red_yellow_blue',
        divergeAt: 0.5,
        minValue: heatmap.min,
        maxValue: heatmap.max,
      }}
      emptyColor="#555555"
      animate={false}
      motionConfig="gentle"
    />
  );
};


export {
  Pie,
  Bar,
  LineOverLastMsgs,
  Line,
  RadarChart,
  Heatmap
};