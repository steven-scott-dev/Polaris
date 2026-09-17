import os
from pydantic import BaseModel
from google import genai
from google.genai import types

# 1. SET YOUR API KEY HERE
API_KEY = "AQ.Ab8RN6L5sA6yhOrbkpcrI1a4_kzXnk3OtKmpQqj-lpXvru2BEQ"

client = genai.Client(api_key=API_KEY)


# 2. DEFINE STRUCTURED AGENT OUTPUT
class AppSpecification(BaseModel):
    app_name: str
    target_audience: str
    core_features: list[str]
    tech_stack: list[str]


class GeneratedCode(BaseModel):
    filename: str
    code: str
    explanation: str


# 3. AGENT 1: PRODUCT ARCHITECT AGENT
def agent_product_architect(user_idea: str) -> AppSpecification:
    prompt = f"You are a Senior Product Architect. Turn this user app idea into a complete build specification: '{user_idea}'"

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=AppSpecification,
            temperature=0.3,
        ),
    )
    return AppSpecification.model_validate_json(response.text)


# 4. AGENT 2: FULL-STACK DEVELOPER AGENT
def agent_developer(spec: AppSpecification) -> GeneratedCode:
    prompt = f"""
    You are an Expert Software Engineer. Write a fully working, self-contained Python backend script based on this specification:
    App Name: {spec.app_name}
    Features: {', '.join(spec.core_features)}
    Stack: {', '.join(spec.tech_stack)}
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=GeneratedCode,
            temperature=0.2,
        ),
    )
    return GeneratedCode.model_validate_json(response.text)


# 5. ORCHESTRATOR LOOP
def run_autonomous_pipeline(idea: str):
    print("=" * 50)
    print("🤖 AGENT 1: Analyzing idea and creating specification...")
    spec = agent_product_architect(idea)

    print(f"\n[App Name]: {spec.app_name}")
    print(f"[Target Audience]: {spec.target_audience}")
    print("[Core Features]:")
    for feat in spec.core_features:
        print(f" - {feat}")

    print("\n" + "=" * 50)
    print("🤖 AGENT 2: Writing executable code from specification...")
    code_output = agent_developer(spec)

    print(f"\n[Generated File]: {code_output.filename}")
    print("\n--- CODE PREVIEW ---")
    print(code_output.code)
    print("\n--- EXPLANATION ---")
    print(code_output.explanation)
    print("=" * 50)


# RUN THE PIPELINE
if __name__ == "__main__":
    # Change this string to test any app idea you want
    my_app_idea = "A simple fitness tracker that logs workouts and predicts rest time using AI"
    run_autonomous_pipeline(my_app_idea)
