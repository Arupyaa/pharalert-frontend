import React from 'react'
import { BarChart, Bar, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import DbCard from '../../components/General/dashboardcard/dbcard/DbCard'
import DbCardHeader from '../../components/General/dashboardcard/dbcardheader/DbCardHeader'
import DbCardBody from '../../components/General/dashboardcard/dbcardbody/DbCardBody'

const jsonResponse = {
  "status": "success",
  "data": {
    "totalSalesRevenue": 458689.71,
    "averageSale": 404.13,
    "salesCount": 1135,
    "chartData": [
      {
        "date": "2026-04-01",
        "revenue": 19233.949999999997,
        "salesCount": 39
      },
      {
        "date": "2026-04-02",
        "revenue": 15548.81,
        "salesCount": 40
      },
      {
        "date": "2026-04-03",
        "revenue": 15363.69,
        "salesCount": 39
      },
      {
        "date": "2026-04-04",
        "revenue": 13081.739999999998,
        "salesCount": 43
      },
      {
        "date": "2026-04-05",
        "revenue": 14213.99,
        "salesCount": 33
      },
      {
        "date": "2026-04-06",
        "revenue": 17107.81,
        "salesCount": 35
      },
      {
        "date": "2026-04-07",
        "revenue": 13013.63,
        "salesCount": 42
      },
      {
        "date": "2026-04-08",
        "revenue": 18276.54,
        "salesCount": 34
      },
      {
        "date": "2026-04-09",
        "revenue": 15610.480000000001,
        "salesCount": 36
      },
      {
        "date": "2026-04-10",
        "revenue": 19148.120000000003,
        "salesCount": 42
      },
      {
        "date": "2026-04-11",
        "revenue": 10746.75,
        "salesCount": 31
      },
      {
        "date": "2026-04-12",
        "revenue": 14395.97,
        "salesCount": 32
      },
      {
        "date": "2026-04-13",
        "revenue": 16092.09,
        "salesCount": 41
      },
      {
        "date": "2026-04-14",
        "revenue": 13767.86,
        "salesCount": 41
      },
      {
        "date": "2026-04-15",
        "revenue": 15000.539999999999,
        "salesCount": 37
      },
      {
        "date": "2026-04-16",
        "revenue": 15403.65,
        "salesCount": 36
      },
      {
        "date": "2026-04-17",
        "revenue": 12878.369999999999,
        "salesCount": 36
      },
      {
        "date": "2026-04-18",
        "revenue": 16631.96,
        "salesCount": 38
      },
      {
        "date": "2026-04-19",
        "revenue": 15985.81,
        "salesCount": 41
      },
      {
        "date": "2026-04-20",
        "revenue": 14496.53,
        "salesCount": 38
      },
      {
        "date": "2026-04-21",
        "revenue": 14627.620000000003,
        "salesCount": 42
      },
      {
        "date": "2026-04-22",
        "revenue": 14390.119999999999,
        "salesCount": 42
      },
      {
        "date": "2026-04-23",
        "revenue": 15330.990000000002,
        "salesCount": 41
      },
      {
        "date": "2026-04-24",
        "revenue": 24570.12,
        "salesCount": 45
      },
      {
        "date": "2026-04-25",
        "revenue": 18532.15,
        "salesCount": 41
      },
      {
        "date": "2026-04-26",
        "revenue": 15674.95,
        "salesCount": 44
      },
      {
        "date": "2026-04-27",
        "revenue": 19756.77,
        "salesCount": 44
      },
      {
        "date": "2026-04-28",
        "revenue": 15147.92,
        "salesCount": 39
      },
      {
        "date": "2026-04-29",
        "revenue": 14660.779999999999,
        "salesCount": 43
      }
    ]
  }
}
const medicationResponse = {
  "status": "success",
  "data": [
    {
      "medicationId": "30",
      "brandName": "Forxiga",
      "genericName": "Dapagliflozin",
      "categoryName": "Diabetes",
      "overallRevenue": 167360,
      "overallQuantity": 523,
      "customRangeRevenue": 93120,
      "customRangeQuantity": 291
    },
    {
      "medicationId": "27",
      "brandName": "Ezetrol",
      "genericName": "Ezetimibe",
      "categoryName": "Cardiovascular",
      "overallRevenue": 92400,
      "overallQuantity": 420,
      "customRangeRevenue": 51700,
      "customRangeQuantity": 235
    },
    {
      "medicationId": "9",
      "brandName": "Plavix",
      "genericName": "Clopidogrel",
      "categoryName": "Cardiovascular",
      "overallRevenue": 88500,
      "overallQuantity": 354,
      "customRangeRevenue": 38500,
      "customRangeQuantity": 154
    },
    {
      "medicationId": "4",
      "brandName": "Augmentin",
      "genericName": "Amoxicillin + Clavulanate",
      "categoryName": "Antibiotics",
      "overallRevenue": 65520,
      "overallQuantity": 364,
      "customRangeRevenue": 37800,
      "customRangeQuantity": 210
    },
    {
      "medicationId": "8",
      "brandName": "Lipitor",
      "genericName": "Atorvastatin",
      "categoryName": "Cardiovascular",
      "overallRevenue": 70200,
      "overallQuantity": 351,
      "customRangeRevenue": 31200,
      "customRangeQuantity": 156
    },
    {
      "medicationId": "5",
      "brandName": "Zithromax",
      "genericName": "Azithromycin",
      "categoryName": "Antibiotics",
      "overallRevenue": 63450,
      "overallQuantity": 423,
      "customRangeRevenue": 26850,
      "customRangeQuantity": 179
    },
    {
      "medicationId": "7",
      "brandName": "Concor",
      "genericName": "Bisoprolol",
      "categoryName": "Cardiovascular",
      "overallRevenue": 48360,
      "overallQuantity": 403,
      "customRangeRevenue": 21840,
      "customRangeQuantity": 182
    },
    {
      "medicationId": "29",
      "brandName": "Duspatalin",
      "genericName": "Mebeverine",
      "categoryName": "Gastrointestinal",
      "overallRevenue": 40700,
      "overallQuantity": 370,
      "customRangeRevenue": 19140,
      "customRangeQuantity": 174
    },
    {
      "medicationId": "18",
      "brandName": "Telfast",
      "genericName": "Fexofenadine",
      "categoryName": "Allergy",
      "overallRevenue": 36125,
      "overallQuantity": 425,
      "customRangeRevenue": 18020,
      "customRangeQuantity": 212
    },
    {
      "medicationId": "25",
      "brandName": "Norvasc",
      "genericName": "Amlodipine",
      "categoryName": "Cardiovascular",
      "overallRevenue": 36100,
      "overallQuantity": 380,
      "customRangeRevenue": 16435,
      "customRangeQuantity": 173
    }
  ]
}

const analyticsSummary = { "status": "success", "data": { "customersCount": 1135, "salesRevenue": 458689.71, "averageSale": 404.13, "inventoryStatus": { "inStock": 21, "criticalStock": 0, "outOfStock": 9 } } }

const monthly_profit_response = { "status": "success", "data": [{ "month": "Jan", "revenue": 0, "salesCount": 0 }, { "month": "Feb", "revenue": 0, "salesCount": 0 }, { "month": "Mar", "revenue": 649752.27, "salesCount": 1355 }, { "month": "Apr", "revenue": 474809.73, "salesCount": 1173 }, { "month": "May", "revenue": 0, "salesCount": 0 }, { "month": "Jun", "revenue": 0, "salesCount": 0 }, { "month": "Jul", "revenue": 0, "salesCount": 0 }, { "month": "Aug", "revenue": 0, "salesCount": 0 }, { "month": "Sep", "revenue": 0, "salesCount": 0 }, { "month": "Oct", "revenue": 0, "salesCount": 0 }, { "month": "Nov", "revenue": 0, "salesCount": 0 }, { "month": "Dec", "revenue": 0, "salesCount": 0 }] }

const customer_activity_response = {
  "status": "success",
  "data": {
    "totalCustomers": 11,
    "totalPurchases": 1135,
    "totalRevenue": 458689.71,
    "chartData": [
      {
        "date": "2026-04-01",
        "customersCount": 7,
        "purchasesCount": 39,
        "revenue": 19233.95
      },
      {
        "date": "2026-04-02",
        "customersCount": 5,
        "purchasesCount": 40,
        "revenue": 15548.81
      },
      {
        "date": "2026-04-03",
        "customersCount": 5,
        "purchasesCount": 39,
        "revenue": 15363.69
      },
      {
        "date": "2026-04-04",
        "customersCount": 7,
        "purchasesCount": 43,
        "revenue": 13081.74
      },
      {
        "date": "2026-04-05",
        "customersCount": 7,
        "purchasesCount": 33,
        "revenue": 14213.99
      },
      {
        "date": "2026-04-06",
        "customersCount": 8,
        "purchasesCount": 35,
        "revenue": 17107.81
      },
      {
        "date": "2026-04-07",
        "customersCount": 6,
        "purchasesCount": 42,
        "revenue": 13013.63
      },
      {
        "date": "2026-04-08",
        "customersCount": 7,
        "purchasesCount": 34,
        "revenue": 18276.54
      },
      {
        "date": "2026-04-09",
        "customersCount": 7,
        "purchasesCount": 36,
        "revenue": 15610.48
      },
      {
        "date": "2026-04-10",
        "customersCount": 10,
        "purchasesCount": 42,
        "revenue": 19148.12
      },
      {
        "date": "2026-04-11",
        "customersCount": 5,
        "purchasesCount": 31,
        "revenue": 10746.75
      },
      {
        "date": "2026-04-12",
        "customersCount": 6,
        "purchasesCount": 32,
        "revenue": 14395.97
      },
      {
        "date": "2026-04-13",
        "customersCount": 4,
        "purchasesCount": 41,
        "revenue": 16092.09
      },
      {
        "date": "2026-04-14",
        "customersCount": 8,
        "purchasesCount": 41,
        "revenue": 13767.86
      },
      {
        "date": "2026-04-15",
        "customersCount": 6,
        "purchasesCount": 37,
        "revenue": 15000.54
      },
      {
        "date": "2026-04-16",
        "customersCount": 8,
        "purchasesCount": 36,
        "revenue": 15403.65
      },
      {
        "date": "2026-04-17",
        "customersCount": 7,
        "purchasesCount": 36,
        "revenue": 12878.37
      },
      {
        "date": "2026-04-18",
        "customersCount": 8,
        "purchasesCount": 38,
        "revenue": 16631.96
      },
      {
        "date": "2026-04-19",
        "customersCount": 9,
        "purchasesCount": 41,
        "revenue": 15985.81
      },
      {
        "date": "2026-04-20",
        "customersCount": 5,
        "purchasesCount": 38,
        "revenue": 14496.53
      },
      {
        "date": "2026-04-21",
        "customersCount": 8,
        "purchasesCount": 42,
        "revenue": 14627.62
      },
      {
        "date": "2026-04-22",
        "customersCount": 5,
        "purchasesCount": 42,
        "revenue": 14390.12
      },
      {
        "date": "2026-04-23",
        "customersCount": 8,
        "purchasesCount": 41,
        "revenue": 15330.99
      },
      {
        "date": "2026-04-24",
        "customersCount": 7,
        "purchasesCount": 45,
        "revenue": 24570.12
      },
      {
        "date": "2026-04-25",
        "customersCount": 5,
        "purchasesCount": 41,
        "revenue": 18532.15
      },
      {
        "date": "2026-04-26",
        "customersCount": 5,
        "purchasesCount": 44,
        "revenue": 15674.95
      },
      {
        "date": "2026-04-27",
        "customersCount": 6,
        "purchasesCount": 44,
        "revenue": 19756.77
      },
      {
        "date": "2026-04-28",
        "customersCount": 8,
        "purchasesCount": 39,
        "revenue": 15147.92
      },
      {
        "date": "2026-04-29",
        "customersCount": 8,
        "purchasesCount": 43,
        "revenue": 14660.78
      }
    ]
  }
}

const analyticsSummaryProcessed = Object.entries(analyticsSummary.data).flatMap(([key, value]) => {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return Object.entries(value).map(([nestedKey, nestedValue]) => ({
      label: `${key}.${nestedKey}`,
      value: nestedValue
    }));
  }

  return [{ label: key, value }];
});
console.log(analyticsSummaryProcessed);

export default function Sales() {
  return (
    <div className='w-full h-[2000px] mt-4 px-4'>
      <div className='flex flex-wrap gap-6'>
        {analyticsSummaryProcessed.map((item) => {
          return (
            <DbCard
            propClassName='max-w-md'
            >
              <DbCardBody
                col="true"
                content={item} />
            </DbCard>
          )
        })}
      </div>

      <h1 className='text-2xl text-center font-bold'>Sales perforamance</h1>
      <ResponsiveContainer width="100%" height="25%">
        <LineChart data={jsonResponse.data.chartData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="date" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke='var(--brand-primary)'
          />
          <Legend />
        </LineChart>
      </ResponsiveContainer>

      <h1 className='text-2xl text-center font-bold'>Monthly Sales</h1>
      <ResponsiveContainer width="100%" height="25%">
        <BarChart data={jsonResponse.data.chartData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="date" />

          <YAxis />

          <Tooltip />

          <Bar dataKey="salesCount" fill='var(--brand-primary)' radius={[10, 10, 0, 0]} />
          <Legend />
        </BarChart>
      </ResponsiveContainer>




      <h1 className='text-2xl text-center font-bold'>customer activity</h1>
      <ResponsiveContainer width="100%" height="25%">
        <BarChart data={customer_activity_response.data.chartData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="date" />

          <YAxis />

          <Tooltip />

          <Bar dataKey="customersCount" fill='var(--brand-primary)' radius={[10, 10, 0, 0]} />
          <Legend />
        </BarChart>
      </ResponsiveContainer>
      <div className='flex w-full h-[1000px] gap-x-4'>
        <ResponsiveContainer width="50%" height="25%">
          <h1 className='text-2xl font-bold my-auto text-nowrap'>Top selling medications</h1>
          <BarChart data={medicationResponse.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="brandName" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="customRangeRevenue" fill='var(--brand-primary)' radius={[10, 10, 0, 0]} name="this month" />
            <Bar dataKey="overallRevenue" fill='var(--accent)' radius={[10, 10, 0, 0]} name="overall" />
            <Legend />
          </BarChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="50%" height="25%">
          <h1 className='text-2xl font-bold my-auto text-nowrap'>monthly profit</h1>
          <BarChart data={monthly_profit_response.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill='var(--brand-primary)' radius={[10, 10, 0, 0]} name="this month" />
            <Legend />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
